<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { readPublicRecipe } from "../../utils/api.js";
import { readUsersFriends, sendChatMessage } from "../../utils/users_api.js";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const recipeId = router.currentRoute.value.params.recipe_id;
const recipe = await readPublicRecipe(recipeId);

const friends = await readUsersFriends(currentUser.id);
const friendCnt = friends.length;

const textMessage = ref("");

const buttonsPressed = ref(
  friends.reduce((arr, friend) => {
    arr[friend.User.id] = false;
    return arr;
  }, {})
);

const alertKey = ref(0);
const error = ref(false);

const send = async (fid) => {
  if ( ! buttonsPressed.value[fid]) {
    sendChatMessage(currentUser.id, fid, textMessage.value, recipe.id)
      .then(async (result) => { // ensure database insert is successfull
        if (result) {
          buttonsPressed.value[fid] = true;
        } else {
          error.value = true;
          alertKey.value++;
        }
      });
  }
}

</script>

<template>
  <!-- :key - make every alert unique with using the given value -->
  <Alert v-if="error" type="danger" :key="alertKey"
    text="Nepodařilo se odeslat recept.">
  </Alert>

  <BasicPageHeader text="Sdílej"></BasicPageHeader>
  <h2><a>{{ recipe.name }}</a></h2>

  <div v-if="currentUser.id == 0">Pro sdílení receptu se přihlaste.</div>

  <div v-else-if="friendCnt == 0">Nemůžete sdílet recept, Váš seznam přátel je prázdný.</div>

  <div v-else>
    <InputText v-model="textMessage" size="large" 
      placeholder="Zde vložte textovou zprávu" style="margin-bottom: 20px"/>

    <div v-for="friend in friends">
      <div v-if="friend.state == 'accepted'" style="display: flex">
        <Message 
          @click="router.push(`/profile/${friend.User.id}`)"
          severity="secondary">
          {{ friend.User.name }}
        </Message>

        <Button icon="pi pi-send" style="margin-left: 10px"
          @click="send(friend.User.id)"
          :class="buttonsPressed[friend.User.id] ? 'p-button-secondary' : 'p-button-primary'">
        </Button>
      </div>
    </div>
  </div>

</template>
