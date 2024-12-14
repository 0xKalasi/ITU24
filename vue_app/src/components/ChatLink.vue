<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";

import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from "../stores/userStore";
const currentUser = useUserStore();

import { getUnseenMessageCount } from "../../utils/users_api";
import { getUnseenGroupchatMessageCount } from "../../utils/groupchat_api";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";


const props = defineProps({
  chatWith: Object
});


const truncateStr = computed(() => (str, max) => {
  if (str.length > max) {
    return str.substring(0, max - 3) + "...";
  } else {
    return str;
  }
});

const GoToChat = async () => {
  if (props.chatWith.is_groupchat) {
    router.push(`/groupchats/${props.chatWith.id}`);
  } else {
    router.push(`/chats/${props.chatWith.id}`);
  }
}

const GoToProfile = async () => {
  if ( ! props.chatWith.is_groupchat) { // Safeguard, do not go to groupchat id equal to chat id
    router.push(`/profile/${props.chatWith.id}`);
  }
}

const GetIcon = computed(() => {
  return props.chatWith.is_groupchat ? "pi pi-users" : "pi pi-user";
});

const ProfileButtonClass = computed(() => {
  return props.chatWith.is_groupchat ? "profile-button not-clickable" : "profile-button";
});

const TextClass = computed(() => {
  return props.chatWith.is_groupchat ? "name-button-groupchat" : "name-button-chat";
});

// Dynamic loading of badges for newest read messages

const NewMessageCount = ref("");

let messageCountChanges;
onMounted(async () => {
  let messageCount = 0;

  if (props.chatWith.is_groupchat) {
    messageCount = await getUnseenGroupchatMessageCount(props.chatWith.id, currentUser.id);
  } else {
    messageCount = await getUnseenMessageCount(currentUser.id, props.chatWith.id);
  }
  NewMessageCount.value = messageCount != 0 ? String(messageCount) : "";

  messageCountChanges = await createSubscription("*", "Message",  async () => {
    let messageCount = 0;
    
    if (props.chatWith.is_groupchat) {
      messageCount = await getUnseenGroupchatMessageCount(props.chatWith.id, currentUser.id);
    } else {
      messageCount = await getUnseenMessageCount(currentUser.id, props.chatWith.id);
    }
    NewMessageCount.value = messageCount != 0 ? String(messageCount) : "";
  });
});
onUnmounted(async () => {
  await removeSubscription(messageCountChanges);
});

</script>

<template>
  <ButtonGroup class="entry">
    <Button
      :icon="GetIcon"
      size="large"
      raised
      @click="GoToProfile"
      :class="ProfileButtonClass">
    </Button>
    
    <Button
      :label="truncateStr(chatWith.name, 23)"
      icon="pi pi-send"
      iconPos="right"
      :badge="NewMessageCount"
      badgeSeverity="primary"
      severity="secondary"
      raised
      @click="GoToChat"
      :class="[TextClass, 'align-icon-right']">
    </Button>
  </ButtonGroup>
</template>

<style scoped>
.entry {
  width: 100%;
  display: flex;
  margin: 20px 0 20px 0;
}

.name-button-chat {
  flex-grow: 1;
}
:deep(.name-button-chat) .p-button-label {
  position: absolute;
  font-weight: normal;
}

.name-button-groupchat {
  flex-grow: 1;
}
:deep(.name-button-groupchat) .p-button-label {
  position: absolute;
  font-weight: bold;
  color: aquamarine;
}

.profile-button {
  width: 50px;
}

.not-clickable {
  pointer-events: none;
}

:deep(.align-icon-right) .p-button-icon-right {
  margin-left: auto;
}

</style>