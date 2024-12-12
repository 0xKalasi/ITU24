<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, onUpdated } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readGroupchat, readGroupchatMessages, sendGroupchatMessage } from "../../utils/groupchat_api";
import { createSubscription, removeSubscription } from "../../utils/subscription_api";
import BasicPageHeader from "../components/basicPageHeader.vue";


const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);

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
    await nextTick();
    //scrollDown();
  });
});
onUnmounted(async () => {
  await removeSubscription(groupMessageChanges);
});

onUpdated(() => {
  scrollDown();
})

// Sending messages

const textMessage = ref("");

const HandleSending = async () => {
  if (textMessage.value.length != 0) { // Do not send an empty message
    await sendGroupchatMessage(currentUser.id, currentGroup.id, textMessage.value, null);
    textMessage.value = "";
  }
}

const IsCreator = computed(() => {
  return (currentUser.id == currentGroup.creator) ? "pi pi-pencil" : "pi pi-plus";
});

const GoToEdit = async () => {
  router.push(`/groupchats/edit/${currentGroup.id}`);
}


const isLoading = ref(false);

</script>

<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>

    <!-- Header -->
    <div style="position: relative; display: flex; align-items: center; min-width: 320px;">
      <!-- TODO there should be a text description with the button -->
      <BasicPageHeader :text="currentGroup.name"></BasicPageHeader>

      <Button
        style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);"
        :icon="IsCreator"
        @click="GoToEdit">
      </Button>
    </div> 

    <Divider style="margin-bottom: 0px; margin-top: 10px;"></Divider>

    <!-- Messages -->
    <!-- TODO: fix height  -->
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

</div>

</template>
