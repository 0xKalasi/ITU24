<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onMounted, onUnmounted, onUpdated, onBeforeMount } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readGroupchatMessages, readGroupchat, sendGroupchatMessage } from '../../utils/groupchat_api';
import { createSubscription, removeSubscription } from '../../utils/subscription_api';


const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);


// Sending messages

const textMessage = ref("");
const HandleSending = async () => {
  if (textMessage.value.length != 0) { // Do not send an empty message
    await sendGroupchatMessage(currentUser.id, currentGroup.id, textMessage.value, null);
    textMessage.value = "";
  }
}

const container = ref(null);

const scrollDown = () => {
  if(container.value){
    container.value.scrollTop = container.value.scrollHeight;
  }
};

// Retrieving messages

const messages = ref([]);

let groupMessageChanges;
onMounted(async () => {
  scrollDown();

  groupMessageChanges = await createSubscription("*", "Message", async () => {
    messages.value = await readGroupchatMessages(currentGroup.id);
  });
});
onUnmounted(async () => {
  await removeSubscription(groupMessageChanges);
});

onUpdated(() => {
  scrollDown();
});


const isLoading = ref(false);

const InitialLoad = async () => {
  isLoading.value = true;

  readGroupchatMessages(currentGroup.id)
  .then(async (result) => {
    messages.value = result;
    isLoading.value = false;
  });
}

onBeforeMount(async () => {
  await InitialLoad();
});

</script>

<template>
  <div
    v-if="isLoading"
    style="height: calc(100vh - 266px);">
    <div style="display: flex; justify-content: center;">
      <i class="pi pi-spin pi-th-large" style="font-size: 2rem; position: absolute; margin-top: 70%;"></i>
    </div>
  </div>

  <div
    v-else
    ref="container"
    style="overflow-y: auto; height: calc(100vh - 266px);">
    <div
      v-if="messages.length == 0"
      style="margin-top: 20px;">
      Skupina je dosud prázdná.
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