<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount, nextTick } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readUser, readChat, sendChatMessage, deleteChatHistory } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";

const peerUserId = router.currentRoute.value.params.user_id;
const peerUser = await readUser(peerUserId);

const scrollDown = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

// Handle retrieving messages

// TODO: go down when:
//// a message appears on the screen (user sent always, peer sent ONLY WHEN ALL THE WAY DOWN)
//// (the rest is in git history)

const messages = ref([]);

let messageChanges;
onMounted(async () => {
  messages.value = await readChat(currentUser.id, peerUser.id);
  scrollDown();

  messageChanges = await createSubscription("*", "Message", async () => {
    messages.value = await readChat(currentUser.id, peerUser.id);
    await nextTick(); // Needed to get the correct scroll
    scrollDown();
  });
});
onUnmounted(async () => {
  await removeSubscription(messageChanges);
});

// Handle sending a text message

const textMessage = ref("");

const HandleSending = async () => {
  if (textMessage.value.length != 0) { // Do not send an empty message
    await sendChatMessage(currentUser.id, peerUserId, textMessage.value, null);
    textMessage.value = "";
  }
}

// Before messages.length is accessed in template, message is not yet defined
onBeforeMount (async () => {
  isLoading.value = true;
  await readChat(currentUser.id, peerUserId)
  .then(async (result) => {
    messages.value = result;
    isLoading.value = false;
  })
});

const DeleteHistory = async () => {
  await deleteChatHistory(currentUser.id, peerUser.id);
}

const GoToRecipe = async(id) => {
  router.push(`/recipe/public/${id}`)
}

const isLoading = ref(false);

</script>

<template>  
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else style="display: flex; flex-direction: column;">

    <!-- Header -->
    <div style="position: fixed;">
      <div>
        <BasicPageHeader
          :text="`Chat s ${peerUser.name}`">
        Chat s
        </BasicPageHeader>
        <Button
          label="Smazat historii"
          icon="pi pi-history"
          size="small"
          style="float: right"
          @click="DeleteHistory">
        </Button>
      </div>
      
      <Divider></Divider>
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
          <Message
            severity="info"
            icon="pi pi-sort-alt"
            @click="GoToRecipe(message.recipe_id)">
            {{ message.Recipe.name }}
          </Message>
          <br/>
        </div>
      </div>
    </div>

    <!-- Entry field -->
    <div style="position: fixed; bottom: 80px;">
      <Divider></Divider>

      <div style="display: flex; align-items: center; margin-top: 20px;">
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
