<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { computed } from "vue";

import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps({
  chat: Object
});

const GoToChat = async () => {
  if (props.chat.is_groupchat) {
    router.push(`/groupchats/${props.chat.id}`);
  } else {
    router.push(`/chats/${props.chat.id}`);
  }
}

const GoToProfile = async () => {
  if ( ! props.chat.is_groupchat) { // Safeguard, do not go to groupchat id equal to chat id
    router.push(`/profile/${props.chat.id}`);
  }
}

const GetIcon = computed(() => {
  return props.chat.is_groupchat ? "pi pi-users" : "pi pi-user";
});

const ProfileButtonClass = computed(() => {
  return props.chat.is_groupchat ? "profile-button not-clickable" : "profile-button";
});

const TextClass = computed(() => {
  return props.chat.is_groupchat ? "name-button-groupchat align-icon-right" : "name-button-chat align-icon-right";
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
      :label="chat.name"
      icon="pi pi-send"
      iconPos="right"
      severity="secondary"
      raised
      @click="GoToChat"
      :class="TextClass">
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