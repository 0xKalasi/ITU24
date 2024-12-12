<script setup>
import { ref, onMounted, onUnmounted, onUpdated, nextTick } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

import { readGroupchatMessages, readGroupchat, sendGroupchatMessage } from '../../utils/groupchat_api';
import { createSubscription, removeSubscription } from '../../utils/subscription_api';

// With this, this component can be used for both chats and groupchats, we just need to do different queries
const isGroupchat = router.currentRoute.value.path.startsWith("/groupchats");


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
})

</script>

<template>
  <div
    ref="container"
    style="overflow-y: auto; height: calc(100vh - 266px);">
    <div v-if="messages.length == 0">
      Skupina je dosud prázdná.
    </div>

    <div v-for="message in messages">
      <MessageComp :message="message"></MessageComp>
    </div>
  </div>

  <!-- Entry field -->
    <div style="display: flex; justify-content: center;">
    <div style="position: fixed; bottom: 80px;">
      <Divider></Divider>

      <InputText
        v-model="textMessage"
        size="large"
        @keydown.enter="HandleSending"/>
      <Button
        icon="pi pi-send"
        @click="HandleSending">
      </Button>
    </div>
  </div>

</template>

<style scoped>
</style>