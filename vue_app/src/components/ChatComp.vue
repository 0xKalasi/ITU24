<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onMounted, onUnmounted, onUpdated } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readUser, sendChatMessage, readChat } from '../../utils/users_api';
import { createSubscription, removeSubscription } from '../../utils/subscription_api';


const peerUserId = router.currentRoute.value.params.user_id;
const peerUser = await readUser(peerUserId);


// Sending messages

const textMessage = ref("");
const HandleSending = async () => {
  if (textMessage.value.length != 0) { // Do not send an empty message
    await sendChatMessage(currentUser.id, peerUser.id, textMessage.value, null);
    textMessage.value = "";
  }
}

const container = ref(null);

const scrollDown = () => {
  if (container.value) {
    container.value.scrollTop = container.value.scrollHeight;
  }
};

// Retrieving messages

const messages = ref([]);

let messageChanges;
onMounted(async () => {
  messages.value = await readChat(currentUser.id, peerUser.id);
  scrollDown();

  messageChanges = await createSubscription("*", "Message", async () => {
    messages.value = await readChat(currentUser.id, peerUser.id);
  });
});
onUnmounted(async () => {
  await removeSubscription(messageChanges);
});

onUpdated(() => {
  scrollDown();
});

</script>

<template>
  <div
    ref="container"
    style="overflow-y: auto; height: calc(100vh - 266px);">
    <div v-if="messages.length == 0" style="margin-top: 20px;">
      Chat je dosud prázdný.
    </div>

    <div v-for="message in messages">
      <MessageComp :message="message"></MessageComp>
    </div>
  </div>

  <!-- Entry field -->
  <Divider></Divider>

  <div class="entry-field">
    <InputText
      v-model="textMessage"
      size="large"
      placeholder="Vaše zpráva"
      @keydown.enter="HandleSending"
      style="width: 90%">
    </InputText>

    <Button
      icon="pi pi-send"
      @click="HandleSending"
      style="min-width: 43px;">
    </Button>
  </div>

</template>

<style scoped>
.entry-field {
  display: flex;
  position: fixed;
  bottom: 80px;
  width: 320px;
  padding-top: 100px;
  gap: 5px;
}

</style>
