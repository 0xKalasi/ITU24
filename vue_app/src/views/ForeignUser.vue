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
import { getAllUsersLikes } from "../../utils/likes_api.js";


const viewedUserId = router.currentRoute.value.params.user_id;
const viewedUser = await readUser(viewedUserId);

const usersRecipes = await readUsersPublicRecipe(viewedUser.id);
const recipeCnt = usersRecipes.length;
const totalLikes = await getAllUsersLikes(viewedUser.id);


const currentFriendshipState = ref(ForeignUserRelation.LOGGED_OUT); // Initally hide the state

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

  <div style="position: relative; overflow-y: auto; height: calc(100vh - 220px);">

    <!-- User info -->

    <div style="margin-bottom: 20px;">
      <h2>
        {{ viewedUser.name }}
      </h2>
      <i v-if="currentFriendshipState != ForeignUserRelation.BLOCKED_BY_THEM">
        <!-- The only thing we show when blocked is name and the fact -->
        {{ viewedUser.bio }}
      </i>
    </div>

    <Divider></Divider>

    <!-- FRIEND RELATION LOGIC -->

    <div style="margin-bottom: 20px">

      <!-- Just for completeness; nothing should be visible when logged out or looking at own profile -->
      <div v-if="currentFriendshipState == ForeignUserRelation.LOGGED_OUT"></div>
      <div v-else-if="currentFriendshipState == ForeignUserRelation.SELF"></div>

      <!-- NO RELATION -->

      <div v-else-if="currentFriendshipState == ForeignUserRelation.NO_RELATION">
        <h3>Poslat žádost o přátelství</h3>
        <Button
          label="Poslat žádost o přátelství"
          icon="pi pi-users"
          @click="SendRequest">
        </Button>

        <Divider style="margin-top: 20px;"></Divider>
      </div>

      <!-- SENT -->

      <div v-else-if="currentFriendshipState == ForeignUserRelation.SENT" >
        <h3>Poslat žádost o přátelství</h3>
        <i>Žádost byla odeslána a čeká na potvrzení</i>

        <Divider style="margin-top: 20px;"></Divider>
      </div>

      <!-- PENDING -->

      <div v-else-if="currentFriendshipState == ForeignUserRelation.PENDING">
        <h3>Od tohoto uživatele máte příchozí žádost o přátelství</h3>

        <Button
          label="Potvrdit"
          icon="pi pi-check"
          @click="AcceptRequest">
        </Button>

        <Divider style="margin-top: 20px;"></Divider>
      </div>

      <!-- ACCEPTED -->

      <div v-else-if="currentFriendshipState == ForeignUserRelation.ACCEPTED">

        <div style="display: flex; align-items: center; margin-top: 20px;">
          <h3>Přátelé</h3>
          <Button
              label="Přejít na chat"
              icon="pi pi-comment"
              @click="GoToChat"
              style="margin-left: auto">
          </Button>

        </div>

        <Divider style="margin-top: 20px;"></Divider>
      </div>

      <!-- BLOCKED BY CURRENT USER -->

      <div v-else-if="currentFriendshipState == ForeignUserRelation.BLOCKED_BY_ME">

        <div style="color: orange; margin-top: 10px; margin-bottom: 10px;">
          S tímto uživatelem nelze komunikovat, je zablokován
        </div>

        <Button
          label="Odblokovat"
          icon="pi pi-lock-open"
          @click="Unblock">
        </Button>

        <Divider style="margin-top: 20px;"></Divider>
      </div>

      <!-- BLOCKED BY PEER -->

      <div v-else-if="currentFriendshipState == ForeignUserRelation.BLOCKED_BY_THEM">
        <div style="color: red; margin-top: 20px;">
          Tento uživatel Vás zablokoval
        </div>

        <Divider style="margin-top: 20px;"></Divider>
      </div>
    </div>

    <div v-if="currentFriendshipState != ForeignUserRelation.BLOCKED_BY_THEM">
      <!-- Statistics, shown only when not blocked -->

      <h3 v-if="recipeCnt >= 5">{{ recipeCnt }} veřejných receptů</h3>
      <h3 v-else-if="recipeCnt >= 2">{{ recipeCnt }} veřejné recepty</h3>
      <h3 v-else-if="recipeCnt == 1">{{ recipeCnt }} veřejný recept</h3>
      <h3 v-else>Žádné veřejné recepty</h3> <!-- recipeCnt == 0 -->

      <h3 v-if="totalLikes >= 5">{{ totalLikes }} kladně hodnocených receptů</h3>
      <h3 v-else-if="totalLikes >= 2">{{ totalLikes }} kladně hodnocené recepty</h3>
      <h3 v-else-if="totalLikes == 1">{{ totalLikes }} kladně hodnocený recept</h3>
      <h3 v-else>Dosud žádná hodnocení receptů</h3> <!-- totalLikes == 0 -->

      <Divider></Divider>

      <!-- Recipe list -->

      <h2>Recepty</h2>

      <div v-for="recipe in usersRecipes">
        <Message
          severity="success"
          icon="pi pi-play-circle"
          @click="GoToRecipe(recipe.id)">
          {{ recipe.name }}
        </Message>
      </div>

    </div>

  </div>

</template>
