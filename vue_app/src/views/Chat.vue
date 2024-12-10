<script setup>
import { useRouter } from "vue-router";
import { readUser, readChat, sendChatMessage, deleteChatHistory } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";

import { ref, onMounted, onUnmounted, onBeforeMount, nextTick } from "vue";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const peerUserId = router.currentRoute.value.params.user_id;
const peerUser = await readUser(peerUserId);

const scrollDown = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

// Handle retrieving messages
const messages = ref([]);

let messageChanges;
onMounted(async () => {
  messages.value = await readChat(currentUser.id, peerUser.id);
  scrollDown();

  messageChanges = await createSubscription("*", "Message", async () => {
    messages.value = await readChat(currentUser.id, peerUser.id);
    await nextTick(); // Needed to get the correct height
    scrollDown();
  });
});
onUnmounted(() => {
  removeSubscription(messageChanges);
});

// Handle sending a text message
const textMessage = ref("");

const handleSending = async () => {
  if (textMessage.value.length != 0) { // Do not send an empty message
    sendChatMessage(currentUser.id, peerUserId, textMessage.value, null);
    textMessage.value = "";
  }
}


const isLoading = ref(false);

// TODO: go down when:
//// a message appears on the screen (user sent always, peer sent ONLY WHEN ALL THE WAY DOWN)
//// (the rest is in git history)

// Before messages.length is accessed in template, message is not yet defined
onBeforeMount (() => {
  isLoading.value = true;
  readChat(currentUser.id, peerUserId)
  .then(async (result) => {
    messages.value = result;
    isLoading.value = false;
  })
});

</script>

<template>  
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else style="display: flex; flex-direction: column;">

    <!-- Header -->
    <div style="position: fixed;">
      <div>
        <BasicPageHeader :text="`Chat s ${peerUser.name}`">Chat s</BasicPageHeader>
        <Button
          label="Smazat historii"
          icon="pi pi-history"
          size="small"
          style="float: right"
          @click="deleteChatHistory(currentUser.id, peerUser.id)">
        </Button>
      </div>
      <br/><br/>
      <div class="devider"></div>
    </div>

    <!-- Messages -->
    <div style="margin-top: 20px; margin-bottom: 60px;">
      <div v-if="messages.length == 0">
        Dosud jste uživateli neposlal/a žádné zprávy.
      </div>

      <div v-for="message in messages" >
        <a v-if="message.person_posted == currentUser.id">
          {{ currentUser.name }}:
        </a>
        <a v-else>
          {{ peerUser.name }}:
        </a>

        {{ message.content }}

        <div v-if="message.recipe_id != null">
          <Message severity="info" icon="pi pi-sort-alt" @click="router.push(`/recipe/public/${message.recipe_id}`)">
            {{ message.Recipe.name }}
          </Message>
          <br/>
        </div>
      </div>
    </div>

    <!-- Entry field -->
    <div style="position: fixed; bottom: 80px;">
      <div class="devider"></div>
      <br/>
      <div style="display: flex; align-items: center;">
        <InputText v-model="textMessage" size="large" @keydown.enter="handleSending"/>
        <Button icon="pi pi-send" @click="handleSending"></Button>
      </div>
    </div>

  </div>

</template>

<style scoped>
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>
