<script setup>
import { useRouter } from "vue-router";
import { readUser, readChat, sendChatMessage } from "../../utils/users_api.js";
import { ref, computed, onUnmounted } from "vue";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const peerUserId = router.currentRoute.value.params.user_id;
const peerUser = await readUser(peerUserId);

// TODO maybe use subscribe
const messages = ref();
messages.value = await readChat(currentUser.id, peerUserId);
const intervalId = setInterval(async () => {
  messages.value = await readChat(currentUser.id, peerUserId);
}, 1000);

const textMessage = ref("");

onUnmounted (() => {
  if (intervalId != null) {
    clearInterval(intervalId);
  }
});

const handleSending = async () => {
  // Do not send an empty message
  if (textMessage.value.length == 0) {
    return;
  }

  sendChatMessage(currentUser.id, peerUserId, textMessage.value);
  textMessage.value="";
}

</script>



<template>  
  <h2>Chat s uživatelem <br/>{{ peerUser.name }}</h2>

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
      {{ message.recipe_id }}
    </div>
  </div>
    
  <!-- TODO: style........ -->
  <div style="bottom: 70px; position: fixed; display: flex; justify-content: center;">
    <InputText v-model="textMessage" size="large"/>
    <Button icon="pi pi-arrow-right" style="margin-left: 10px;"
      @click="handleSending">
    </Button>
  </div>

</template>
