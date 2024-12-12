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
  if ( ! props.chat.is_groupchat) {
    router.push(`/profile/${props.chat.id}`);
  }
}

const GetIcon = computed(() => {
  return props.chat.is_groupchat ? "pi pi-comments" : "pi pi-comment";
});

const TextClass = computed(() => {
  return props.chat.is_groupchat ? "name-button-groupchat" : "name-button-chat";
});

</script>

<template>
  <ButtonGroup class="groupchat">
    <Button
      :label="chat.name"
      severity="secondary"
      raised
      :disabled="chat.is_groupchat"
      @click="GoToProfile"
      :class="TextClass">
    </Button>

    <Button
      :icon="GetIcon"
      iconPos="right"
      severity="primary"
      size="large"
      raised
      @click="GoToChat"
      class="conversation-button">
    </Button>
  </ButtonGroup>
</template>

<style scoped>
.groupchat {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
}

.name-button-chat {
  flex-grow: 1;
}

.name-button-groupchat {
  flex-grow: 1;
}

:deep(.name-button-chat) .p-button-label {
  font-weight: normal;
}

:deep(.name-button-groupchat) .p-button-label {
  font-weight: bold;
  color: aquamarine;
}

.conversation-button {
  width: 100px;
}

</style>