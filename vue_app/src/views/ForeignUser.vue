<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { acceptFriendRequest, readUser } from "../../utils/users_api.js";
import { readUsersPublicRecipe } from "../../utils/api.js";
import { sendFriendRequest, ForeignUserRelation, getFriendshipState, unblockUser } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";


const viewedUserId = router.currentRoute.value.params.user_id;
const viewedUser = await readUser(viewedUserId);

const usersRecipes = await readUsersPublicRecipe(viewedUser.id);
const recipeCnt = usersRecipes.length;
const totalLikes = usersRecipes.reduce((total, recipe) => total + recipe.like_count, 0);

const currentFriendshipState = ref(ForeignUserRelation.loggedOut); // Initally hide the state

// Frienship state is stored in DB, so we need to listen to it
let stateChanges;
onMounted(async () => {
  // First get the intial value ...
  currentFriendshipState.value = await getFriendshipState(currentUser.id, viewedUserId);

  // ... then listen to events
  stateChanges = await createSubscription("*", "FriendStatus", async () => {
    currentFriendshipState.value = await getFriendshipState(currentUser.id, viewedUserId);
  });
});
onUnmounted(async () => {
  await removeSubscription(stateChanges);
});

const GoToRecipe = async (id) => {
  router.push(`/recipe/public/${id}`);
}

const SendRequest = async () => {
  await sendFriendRequest(currentUser.id, viewedUser.id);
}

const AcceptRequest = async () => {
  await acceptFriendRequest(currentUser.id, viewedUser.id);
}

const GoToChat = async () => {
  router.push(`/chats/${viewedUser.id}`);
}

const Unblock = async () => {
  await unblockUser(currentUser.id, viewedUser.id);
}

</script>

<template>  
  <BasicPageHeader text="Profil uživatele"></BasicPageHeader>

  <div style="margin-bottom: 20px;">
    <h2>
      {{ viewedUser.name }}
    </h2>
    <i>
      {{ viewedUser.bio }}
    </i>
  </div>

  <Divider></Divider>

  <h3 v-if="recipeCnt >= 5">{{ recipeCnt }} veřejných receptů</h3>
  <h3 v-else-if="recipeCnt >= 2">{{ recipeCnt }} veřejné recepty</h3>
  <h3 v-else-if="recipeCnt == 1">{{ recipeCnt }} veřejný recept</h3>
  <h3 v-else>Žádné veřejné recepty</h3> <!-- recipeCnt == 0 -->

  <h3 v-if="totalLikes >= 5">{{ totalLikes }} spokojených kuchařů</h3>
  <h3 v-else-if="totalLikes >= 2">{{ totalLikes }} spokojení kuchaři</h3>
  <h3 v-else-if="totalLikes == 1">{{ totalLikes }} spokojený kuchař</h3>
  <h3 v-else>Dosud žádná hodnocení receptů</h3> <!-- totalLikes == 0 -->

  <Divider></Divider>

  <h2>Recepty</h2>

  <div v-for="recipe in usersRecipes">
    <Message
      severity="success"
      icon="pi pi-play-circle"
      @click="GoToRecipe(recipe.id)">
      {{ recipe.name }}
    </Message>
  </div>

  <!-- Just for completeness; nothing should be output when logged out or looking at own profile -->
  <div v-if="currentFriendshipState == ForeignUserRelation.LOGGED_OUT"></div>
  <div v-else-if="currentFriendshipState == ForeignUserRelation.SELF"></div>
  <!-- -->
  <div
    v-else-if="currentFriendshipState == ForeignUserRelation.NO_RELATION"
    style="margin-top: 20px;">
    <Divider></Divider>

    <h3>Poslat žádost o přátelství</h3>
    <Button
      label="Poslat žádost o přátelství"
      icon="pi pi-users"
      @click="SendRequest">
    </Button>
  </div>
  <div 
    v-else-if="currentFriendshipState == ForeignUserRelation.SENT" 
    style="margin-top: 20px;">
    <Divider></Divider>

    <h3>Poslat žádost o přátelství</h3>
    <a>Žádost byla odeslána a čeká na potvrzení</a>
  </div>
  <div
    v-else-if="currentFriendshipState == ForeignUserRelation.PENDING"
    style="margin-top: 20px;">
    <Divider></Divider>

    <h3>Od tohoto uživatele máte příchozí žádost o přátelství</h3>
    <Button
      label="Potvrdit"
      icon="pi pi-check"
      style="float: right;"
      @click="AcceptRequest">
    </Button>
  </div>
  <div
    v-else-if="currentFriendshipState == ForeignUserRelation.ACCEPTED"
    style="margin-top: 20px;">
    <Divider></Divider>

    <div style="display: flex; align-items: center">
      <h3>Přátelé</h3>
      <Button
          label="Přejít na chat"
          icon="pi pi-comment"
          @click="GoToChat"
          style="margin-left: auto">
      </Button>
    </div>
  </div>
  <div
    v-else-if="currentFriendshipState == ForeignUserRelation.BLOCKED_BY_ME"
    style="margin-top: 20px;">
    <Divider></Divider>

    <div style="color: orange; margin-top: 20px;">
      S tímto uživatelem nelze komunikovat, je zablokován
    </div>

    <Button
      label="Odblokovat"
      icon="pi pi-lock-open"
      @click="Unblock"
      style="float: right">
    </Button>
  </div>
  <div
    v-else-if="currentFriendshipState == ForeignUserRelation.BLOCKED_BY_THEM"
    style="margin-top: 20px;">
    <Divider></Divider>

    <div style="color: red; margin-top: 20px;">
      Tento uživatel Vás zablokoval
    </div>
  </div>

</template>
