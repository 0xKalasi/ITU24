<script setup>
import { useRouter } from "vue-router";

import { readUsersPublicRecipe } from "../../utils/api.js";

import { useUserStore, profilePreviewStore } from '../stores/userStore';
import BasicPageHeader from "../components/basicPageHeader.vue";

const currentUser = useUserStore();
const previewData = profilePreviewStore();

const router = useRouter();

const usersRecipes = await readUsersPublicRecipe(currentUser.id);
const recipeCnt = usersRecipes.length;
const totalLikes = usersRecipes.reduce((total, recipe) => total + recipe.like_count, 0);

</script>

<template>
  <a style="color: aquamarine; display: flex; justify-content: center;">Takto Vás uvidí ostatní uživatelé</a>
  <div class="devider"></div>
  
  <BasicPageHeader text="Profil uživatele" ></BasicPageHeader>

  <h2>{{ previewData.name }}</h2>
  {{ previewData.bio }}
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

  <br/>
  <div class="devider"></div>

  <!-- TODO think what to put here !! -->

</template>

<style scoped>
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>
