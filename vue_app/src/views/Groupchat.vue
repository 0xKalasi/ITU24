<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';

import { readGroupchat, readGroupchatMessages, sendGroupchatMessage } from "../../utils/groupchat_api";

import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { createSubscription, removeSubscription } from "../../utils/subscription_api";

const currentUser = useUserStore();

const router = useRouter();

const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);

const scrollDown = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

// Retrieve messages
const messages = ref([]);

let groupMessageChanges;
onMounted(async () => {
  messages.value = await readGroupchatMessages(currentGroup.id);
  scrollDown();

  groupMessageChanges = await createSubscription("INSERT", "Message", async () => {
    messages.value = await readGroupchatMessages(currentGroup.id);
    await nextTick();
    scrollDown();
  });
});
onUnmounted(() => {
  removeSubscription(groupMessageChanges);
});

// Send message
const textMessage = ref("");

const handleSending = async () => {
  if (textMessage.value.length != 0) { // Do not send an empty message
    sendGroupchatMessage(currentUser.id, currentGroup.id, textMessage.value, null);
    textMessage.value = "";
  }
}

const isCreator = (currentUser.id == currentGroup.creator) ? true : false;

const isLoading = ref(false);

</script>

<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else style="display: flex; flex-direction: column;">

    <!-- Header -->
    <div style="position: fixed;">
      <div style="display: flex; align-items: center;">
        <BasicPageHeader :text="currentGroup.name"></BasicPageHeader>
        <Button
          :icon="isCreator ? `pi pi-pencil` : `pi pi-plus`"
          @click="router.push(`/groupchats/edit/${currentGroup.id}`)"></Button>
      </div> <!-- TODO there should be a text description with the button -->
      <div class="devider"></div>
    </div>

    <!-- Messages -->
    <div style="margin-top: 90px; margin-bottom: 60px">
      <div v-if="messages.length == 0">
        Skupina je dosud prázdná.
      </div>

      <div v-for="message in messages" :key="message.id">
        <a>{{ message.User.name }}:</a>
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
        <InputText v-model="textMessage" size="large"/>
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

