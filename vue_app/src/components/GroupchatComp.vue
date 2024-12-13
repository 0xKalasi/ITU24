<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onMounted, onUnmounted, onUpdated, nextTick } from 'vue';

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
  messages.value = await readGroupchatMessages(currentGroup.id);
  scrollDown();

  groupMessageChanges = await createSubscription("INSERT", "Message", async () => {
    messages.value = await readGroupchatMessages(currentGroup.id);
    //await nextTick();
    //scrollDown();
  });
});
onUnmounted(async () => {
  await removeSubscription(groupMessageChanges);
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
      Skupina je dosud prázdná.
    </div>

    <div v-for="message in messages">
      <MessageComp :message="message"></MessageComp>
    </div>
  </div>

  <!-- Entry field -->
  <Divider></Divider>

  <div style="display: flex; position: fixed; bottom: 80px; width: 320px; padding-top: 100px; gap: 5px;">
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
</style>