<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore, profilePreviewStore } from '../stores/userStore';
const currentUser = useUserStore();
const previewData = profilePreviewStore();

import { readUsersPublicRecipe } from "../../utils/api.js";

const usersRecipes = await readUsersPublicRecipe(currentUser.id);
const recipeCnt = usersRecipes.length;
const totalLikes = usersRecipes.reduce((total, recipe) => total + recipe.like_count, 0);

</script>

<template>
  <a style="color: aquamarine; display: flex; justify-content: center;">
    Takto Vás uvidí ostatní uživatelé
  </a>
  <Divider></Divider>
  
  <BasicPageHeader text="Profil uživatele"></BasicPageHeader>

  <div style="margin-bottom: 20px;">
    <h2>
      {{ previewData.name }}
    </h2>
    <i>
      {{ previewData.bio }}
    </i>
  </div>

  <Divider></Divider>

  <h3 v-if="recipeCnt >= 5">{{ usersRecipes.length }} veřejných receptů</h3>
  <h3 v-else-if="recipeCnt >= 2">{{ usersRecipes.length }} veřejné recepty</h3>
  <h3 v-else-if="recipeCnt == 1">{{ usersRecipes.length }} veřejný recept</h3>
  <h3 v-else>Žádné veřejné recepty</h3> <!-- recipeCnt == 0 -->

  <h3 v-if="totalLikes >= 5">{{ totalLikes }} spokojených kuchařů</h3>
  <h3 v-else-if="totalLikes >= 2">{{ totalLikes }} spokojení kuchaři</h3>
  <h3 v-else-if="totalLikes == 1">{{ totalLikes }} spokojený kuchař</h3>
  <h3 v-else>Dosud žádná hodnocení receptů</h3> <!-- totalLike == 0 -->

  <Divider></Divider>

  <h2>Recepty</h2>

  <div v-for="recipe in usersRecipes">
    <!-- This is a preview, so click functionality is disabled -->
    <Message
      severity="success"
      icon="pi pi-play-circle">
      {{ recipe.name }}
    </Message>
  </div>

  <Divider style="margin-top: 20px;"></Divider>

</template>
