<script setup>
import { useRouter } from "vue-router";
import { readUser } from "../../utils/users_api.js";

import { readUsersPublicRecipe } from "../../utils/api.js";
import { sendFriendRequest, ForeignUserRelation, getFriendshipState } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";

import { ref, onMounted, onUnmounted } from "vue";

import { useUserStore } from '../stores/userStore';
import BasicPageHeader from "../components/basicPageHeader.vue";
import { supabase } from "../../utils/supabase.js";
const currentUser = useUserStore();

const router = useRouter();

const viewedUserId = router.currentRoute.value.params.user_id;
const viewedUser = await readUser(viewedUserId);

const usersRecipes = await readUsersPublicRecipe(viewedUserId);
const recipeCnt = usersRecipes.length;
const totalLikes = usersRecipes.reduce((total, recipe) => total + recipe.like_count, 0);

const currentFriendshipState = ref(ForeignUserRelation.loggedOut); // Initally hide the state

// Frienship state is stored in db, so we need to listen to it
let stateChanges;
onMounted(async() => {
  // First get the intial value ...
  currentFriendshipState.value = await getFriendshipState(currentUser.id, viewedUserId);

  // ... then listen to insertions
  stateChanges = await createSubscription("INSERT", "FriendStatus", async () => {
    currentFriendshipState.value = await getFriendshipState(currentUser.id, viewedUserId);
  });
});
onUnmounted(() => {
  removeSubscription(stateChanges);
});

</script>

<template>  
  <BasicPageHeader text="Profil uživatele" />

  <h2>{{ viewedUser.name }}</h2>
  {{ viewedUser.bio }}
  <br/><br/>
  <div class="devider"></div>

  <h3 v-if="recipeCnt >= 5">{{ usersRecipes.length }} veřejných receptů</h3>
  <h3 v-else-if="recipeCnt >= 2">{{ usersRecipes.length }} veřejné recepty</h3>
  <h3 v-else-if="recipeCnt == 1">{{ usersRecipes.length }} veřejný recept</h3>
  <h3 v-else>Žádné veřejné recepty</h3> <!-- recipeCnt == 0 -->

  <h3 v-if="totalLikes >= 5">{{ totalLikes }} spokojených kuchařů</h3>
  <h3 v-else-if="totalLikes >= 2">{{ totalLikes }} spokojení kuchaři</h3>
  <h3 v-else-if="totalLikes == 1">{{ totalLikes }} spokojený kuchař</h3>
  <h3 v-else>Dosud žádná hodnocení receptů</h3> <!-- totalLike == 0 -->

  <div class="devider"></div>
  <h2>Recepty</h2>

  <div v-for="recipe in usersRecipes">
    <Message severity="success" icon="pi pi-play-circle" @click="router.push(`/recipe/public/${recipe.id}`)">
      {{ recipe.name }}
    </Message>
  </div>

  <!-- Just for completeness; nothing should be output when logged out or looking at own profile -->
  <div v-if="currentFriendshipState == ForeignUserRelation.loggedOut"></div>
  <div v-else-if="currentFriendshipState == ForeignUserRelation.self"></div>
  <!---->
  <div v-else-if="currentFriendshipState == ForeignUserRelation.noRelation">
    <br/>
    <div class="devider"></div>

    <h3>Poslat žádost o přátelství</h3>
    <Button label="Poslat žádost o přátelství" icon="pi pi-users"
      @click="sendFriendRequest(currentUser.id, viewedUserId)">
    </Button>
  </div>
  <div v-else-if="currentFriendshipState == ForeignUserRelation.pending">
    <br/>
    <div class="devider"></div>

    <h3>Poslat žádost o přátelství</h3>
    <a>Žádost byla odeslána a čeká na potvrzení.</a>
  </div>
  <div v-else-if="currentFriendshipState == ForeignUserRelation.accepted">
    <br/>
    <div class="devider"></div>

    <div style="display: flex; align-items: center">
      <h3>Přátelé</h3>
      <Button
          label="Přejít na chat"
          icon="pi pi-comment"
          @click="router.push(`/chats/${viewedUserId}`)"
          style="margin-left: auto">
      </Button>
    </div>
  </div>
  <div v-else-if="currentFriendshipState == ForeignUserRelation.blocked">
    <br/>
    <div class="devider"></div>

    <br/>
    <a style="color: red">S tímto uživatelem nelze komunikovat, je zablokován.</a>
  </div>

</template>

<style scoped>
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>
