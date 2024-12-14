<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();


import { readPublicRecipe } from "../../utils/api.js";
import { readUsersFriends, sendChatMessage } from "../../utils/users_api.js";
import { readUsersGroupchats, sendGroupchatMessage } from "../../utils/groupchat_api.js";


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
const alertFlag = ref(false);

const IsLoggedOut = computed (() => {
  return currentUser.id == 0;
});

const GoToFriend = async (id) => {
  router.push(`/profile/${id}`);
}

const FriendSend = async (fid) => {
  if ( ! friendsButtonsPressed.value[fid]) {
    await sendChatMessage(currentUser.id, fid, textMessage.value, recipe.id)
      .then(async (result) => { // ensure database insert is successfull
        if (result) {
          friendsButtonsPressed.value[fid] = true;
        } else {
          alertFlag.value = true;
          alertKey.value++;
        }
      });
  }
}
const GroupSend = async (gid) => {
  if ( ! groupsButtonsPressed.value[gid]) {
    await sendGroupchatMessage(currentUser.id, gid, textMessage.value, recipe.id)
      .then(async (result) => {
        if (result) {
          groupsButtonsPressed.value[gid] = true;
        } else {
          alertFlag.value = true;
          alertKey.value++;
        }
      });
  }
}

const ChatButtonType = (id) => {
  return friendsButtonsPressed.value[id] ? 'p-button-secondary not-clickable' : 'p-button-primary';
}
const GroupchatButtonType = (id) => {
  return groupsButtonsPressed.value[id] ? 'p-button-secondary not-clickable' : 'p-button-primary';
}

</script>

<template>
  <!-- :key - make every alert unique using the given value -->
  <Alert
    v-if="alertFlag"
    type="danger" 
    text="Nepodařilo se odeslat recept."
    :key="alertKey">
  </Alert>

  <BasicPageHeader text="Sdílení"></BasicPageHeader>

  <h2>
    <i>
      {{ recipe.name }}
    </i>
  </h2>

  <div style="position: relative; overflow-y: auto; height: calc(100vh - 290px);">
    <div v-if="IsLoggedOut">
      Pro sdílení receptu se přihlaste.
    </div>

    <div v-else>
      <Divider></Divider>

      <!-- Entry field -->
      <div style="margin-top: 10px; margin-bottom: 20px;">
        <label for="input_field">Zpráva</label>
        <InputText
          id="input_field"
          v-model="textMessage"
          placeholder="Vaše zpráva"
          size="large"
          style="margin-top: 10px; width: 100%;">
        </InputText>
      </div>

      <Divider></Divider>

      <!-- Friends -->
      <div style="margin-bottom: 20px;">
        <h3>Přátelé</h3>

        <div v-if="friends.length == 0">
          Váš seznam přátel je prázdný.
        </div>

        <div v-else>
          <div
            v-for="friend in friends"
            style="display: flex; width: 100%; gap: 30px; margin-bottom: 5px">
            <Message 
              severity="secondary"
              @click="GoToFriend(friend.id)"
              style="flex-grow: 1;">
              {{ friend.name }}
            </Message>

            <Button
              icon="pi pi-send"
              @click="FriendSend(friend.id)"
              :class="ChatButtonType(friend.id)">
            </Button>
          </div>
        </div>
      </div>

      <Divider></Divider>

      <!-- Groups -->
      <div style="margin-bottom: 20px;">
        <h3>Skupiny</h3>

        <div v-if="groupchats.length == 0">
          Nejste členem žádné skupiny.
        </div>

        <div v-else>
          <div
            v-for="groupchat in groupchats"
            style="display: flex; width: 100%; gap: 30px; margin-bottom: 5px; align-items: center;">
            <b style="flex-grow: 1;">
              {{ groupchat.name }}
            </b>

            <Button
              icon="pi pi-send"
              @click="GroupSend(groupchat.id);"
              :class="GroupchatButtonType(groupchat.id)">
            </Button>
          </div>
        </div>
      </div>
    
    </div>

    <Divider></Divider>

  </div>

</template>

<style scoped>
.not-clickable {
  pointer-events: none;
}

</style>
