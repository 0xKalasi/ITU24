<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';

import { readGroupchat, readGroupchatMessages, sendGroupchatMessage } from "../../utils/groupchat_api";

import { ref, onMounted, onUnmounted, nextTick, onUpdated } from "vue";
import { createSubscription, removeSubscription } from "../../utils/subscription_api";

const currentUser = useUserStore();

const router = useRouter();

const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);

const container = ref(null);

const scrollDown = () => {
  //window.scrollTo(0, document.body.scrollHeight);

  if(container.value){
    container.value.scrollTop = container.value.scrollHeight;
  }
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
    //scrollDown();
  });
});

onUpdated(() => {
  scrollDown();
})

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

  <div v-else>

    <!-- Header -->
     <!-- TODO there should be a text description with the button -->
   <!--  <div style="position: fixed;">
      <div style="display: flex; align-items: center;">
        <BasicPageHeader :text="currentGroup.name"></BasicPageHeader>
        <Button
          :icon="isCreator ? `pi pi-pencil` : `pi pi-plus`"
          @click="router.push(`/groupchats/edit/${currentGroup.id}`)"></Button>
      </div> 
      <div class="devider"></div>
    </div> -->
    
    <div style="position: relative; display: flex; align-items: center; min-width: 320px;">
        <Button @click="router.back" icon="pi pi-chevron-left"
                style="height: 35px; width: 35px; background-color: transparent; 
                color: white; border: 0px;"/>
          
        <h2 style="max-width: 240px;">{{ currentGroup.name }}</h2>

        <Button style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);"
                :icon="isCreator ? `pi pi-pencil` : `pi pi-plus`"
                @click="router.push(`/groupchats/edit/${currentGroup.id}`)"/>
    </div> 

    <!-- Messages -->
    <!-- TODO: fix height  -->
    <div ref="container" style="margin: 10px 20px; overflow-y: auto; height: calc(100vh - 250px);">
      <div v-if="messages.length == 0">
        Skupina je dosud prázdná.
      </div>

      <div v-for="message in messages" :key="message.id">
        <a>{{ message.User.name }}:</a> {{ message.content }}

        <div v-if="message.recipe_id != null">
          <Message severity="info" icon="pi pi-sort-alt" @click="router.push(`/recipe/public/${message.recipe_id}`)">
            {{ message.Recipe.name }}
          </Message>
        </div>
      </div>
    </div>

    <!-- Entry field -->
    <div style="display: flex; justify-content: center; margin-top: 10px;">
      <div style="position: fixed; bottom: 80px;">
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

