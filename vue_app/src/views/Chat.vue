<script setup>
import { useRouter } from "vue-router";
import { readUser, readChat, sendChatMessage } from "../../utils/users_api.js";
import { ref, onUnmounted, onBeforeMount, onMounted, onUpdated } from "vue";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const peerUserId = router.currentRoute.value.params.user_id;
const peerUser = await readUser(peerUserId);

// TODO maybe use subscribe?
const messages = ref();
const textMessage = ref("");

const isLoading = ref(false);

const scrollDown = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

onMounted(() => {
  scrollDown();
});
// TODO: go down when: // a message appears on the screen (user sent always, peer sent ONLY WHEN ALL THE WAY DOWN)

onBeforeMount (() => { // before messages.length is accessed in template, message is not yet defined
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
  // TODO !!! potential solution for scrolling and messages - initially use readChat -> get latest timestamp ->
    // -> in interval only retrieve messages with stored timestamp -> append to messages (rerender?) -> 
    // check whether to scroll down again, do so if the message was sent from client, do so if it was sent
    // from peer only if we're already at the bottom -> refresh latest timestamp -> do again in next
    // interval iteration -> repeat forever until closed
  messages.value = await readChat(currentUser.id, peerUserId);
}, 1000);

const handleSending = async () => {
  if (textMessage.value.length == 0) { // Do not send an empty message
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

    <div style="bottom: 70px; position: fixed; display: flex; justify-content: center;">
      <InputText v-model="textMessage" size="large"/>
      <Button icon="pi pi-send" style="margin-left: 10px;"
        @click="handleSending">
      </Button>
    </div>

    <div style="height: 30px"></div>
  </div>

</template>
