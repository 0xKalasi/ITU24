<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { readPublicRecipe } from "../../utils/api.js";
import { readUsersFriends, sendChatMessage } from "../../utils/users_api.js";
import { readUsersGroupchats, sendGroupchatMessage } from "../../utils/groupchat_api.js";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const recipeId = router.currentRoute.value.params.recipe_id;
const recipe = await readPublicRecipe(recipeId);

const friends = await readUsersFriends(currentUser.id);
const groupchats = await readUsersGroupchats(currentUser.id);

const friendsButtonsPressed = ref(
  friends.reduce((arr, friend) => {
    arr[friend.id] = false;
    return arr;
  }, {})
);
const groupsButtonsPressed = ref(
  groupchats.reduce((arr, groupchat) => {
    arr[groupchat.id] = false;
    return arr;
  }, {})
); 

const textMessage = ref("");
const alertKey = ref(0);
const errorFlag = ref(false);

const friendSend = async (fid) => {
  if ( ! friendsButtonsPressed.value[fid]) {
    sendChatMessage(currentUser.id, fid, textMessage.value, recipe.id)
      .then(async (result) => { // ensure database insert is successfull
        if (result) {
          friendsButtonsPressed.value[fid] = true;
        } else {
          errorFlag.value = true;
          alertKey.value++;
        }
      });
  }
}
const groupSend = async (gid) => {
  if ( ! groupsButtonsPressed.value[gid]) {
    sendGroupchatMessage(currentUser.id, gid, textMessage.value, recipe.id)
      .then(async (result) => {
        if (result) {
          groupsButtonsPressed.value[gid] = true;
        } else {
          errorFlag.value = true;
          alertKey.value++;
        }
      });
  }
}

</script>

<template>
  <!-- :key - make every alert unique using the given value -->
  <Alert v-if="errorFlag" type="danger" :key="alertKey"
    text="Nepodařilo se odeslat recept.">
  </Alert>

  <BasicPageHeader text="Sdílej"></BasicPageHeader>
  <h2><a>{{ recipe.name }}</a></h2>

  <div v-if="currentUser.id == 0">
    Pro sdílení receptu se přihlaste.
  </div>

  <div v-else>
    <div class="devider"></div>
    <br/>

    <InputText v-model="textMessage" size="large" 
        placeholder="Zde vložte textovou zprávu" style="margin-bottom: 20px"/>

    <div class="devider"></div>
    <h3>Přátelé</h3>

    <div v-if="friends.length == 0">
      Váš seznam přátel je prázdný.
    </div>
    <div v-else>
      <div v-for="friend in friends" style="display: flex">
        <Message 
          @click="router.push(`/profile/${friend.id}`)"
          severity="secondary">
          {{ friend.name }}
        </Message>

        <Button icon="pi pi-send" style="margin-left: 10px"
          @click="friendSend(friend.id)"
          :class="friendsButtonsPressed[friend.id] ? 'p-button-secondary' : 'p-button-primary'">
        </Button>
      </div>
    </div>

    <br/>

    <div class="devider"></div>
    <h3>Skupiny</h3>

    <div v-if="groupchats.length == 0">
      Nejste členem žádné skupiny.
    </div>
    <div v-else>
      <div v-for="groupchat in groupchats" style="display: flex">
        <b>{{ groupchat.name }}</b>

        <Button icon="pi pi-send" style="margin-left: 10px"
          @click="groupSend(groupchat.id);"
          :class="groupsButtonsPressed[groupchat.id] ? 'p-button-secondary' : 'p-button-primary'">
        </Button>
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
