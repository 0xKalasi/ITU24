<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, onUpdated } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readGroupchat, readGroupchatMessages, sendGroupchatMessage } from "../../utils/groupchat_api";
import { createSubscription, removeSubscription } from "../../utils/subscription_api";


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

const GoToRecipe = async(id) => {
  router.push(`/recipe/public/${id}`)
}

const isLoading = ref(false);

</script>

<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>

    <!-- Header -->
    <div style="position: relative; display: flex; align-items: center; min-width: 320px;">
      <!-- TODO there should be a text description with the button -->
      <Button
        @click="router.back" icon="pi pi-chevron-left"
        style="height: 35px; width: 35px; background-color: transparent; color: white; border: 0px;">
      </Button>
        
      <h2 style="max-width: 240px;">
        {{ currentGroup.name }}
      </h2>

      <Button
        style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);"
        :icon="IsCreator"
        @click="GoToEdit">
      </Button>
    </div> 

    <!-- Messages -->
    <!-- TODO: fix height  -->
    <div
      ref="container"
      style="margin: 10px 20px; overflow-y: auto; height: calc(100vh - 250px);">
      <div v-if="messages.length == 0">
        Skupina je dosud prázdná.
      </div>

      <div v-for="message in messages">
        <a>{{ message.User.name }}:</a> {{ message.content }}

        <div v-if="message.recipe_id != null">
          <Message
            severity="info"
            icon="pi pi-sort-alt"
            @click="GoToRecipe(message.recipe_id)">
            {{ message.Recipe.name }}
          </Message>
        </div>
      </div>
    </div>

    <!-- Entry field -->
    <div style="display: flex; justify-content: center; margin-top: 10px;">
      <div style="position: fixed; bottom: 80px;">
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
