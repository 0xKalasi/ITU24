<script setup>
import { useRouter } from "vue-router";
import { readUser, readChat, sendChatMessage } from "../../utils/users_api.js";
import { readRecipe } from "../../utils/api.js";
import { ref, computed, onUnmounted, onBeforeMount } from "vue";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const peerUserId = router.currentRoute.value.params.user_id;
const peerUser = await readUser(peerUserId);

// TODO maybe use subscribe
const messages = ref();
const textMessage = ref("");

const isLoading = ref(false);

onBeforeMount (() => { // before messages.length is accessed, message is not yet defined
  isLoading.value = true;
  readChat(currentUser.id, peerUserId)
  .then(async (result) => {
    messages.value = result;
    isLoading.value = false;
  })
});

onUnmounted (() => {
  if (intervalId != null) {
    clearInterval(intervalId);
  }
});

const intervalId = setInterval(async () => {
  messages.value = await readChat(currentUser.id, peerUserId);
}, 1000);

const handleSending = async () => {
  // Do not send an empty message
  if (textMessage.value.length == 0) {
    return;
  }

  sendChatMessage(currentUser.id, peerUserId, textMessage.value, null);
  textMessage.value="";
}

</script>



<template>  
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>
    <h2>Chat s uživatelem
      <Message severity="secondary" @click="router.push(`/profile/${peerUserId}`)"
        style="display: inline-block"
        size="large">
        {{ peerUser.name }}
      </Message>
    </h2>

    <div v-if="messages.length == 0">
      Dosud jste uživateli neposlal/a žádné zprávy.
    </div>

    <div v-for="message in messages">
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
      
    <!-- TODO: style........ -->
    <div style="bottom: 70px; position: fixed; display: flex; justify-content: center;">
      <InputText v-model="textMessage" size="large"/>
      <Button icon="pi pi-send" style="margin-left: 10px;"
        @click="handleSending">
      </Button>
    </div>
  </div>

</template>
