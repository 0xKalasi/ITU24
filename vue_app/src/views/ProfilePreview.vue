<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onBeforeMount } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore, profilePreviewStore } from '../stores/userStore';
const currentUser = useUserStore();
const previewData = profilePreviewStore();


import { readUsersPublicRecipe } from "../../utils/api.js";
import { getAllUsersLikes } from "../../utils/likes_api.js";


const usersRecipes = await readUsersPublicRecipe(currentUser.id);
const recipeCnt = usersRecipes.length;

let totalLikes;

const isLoading = ref(false);

const LoadData = async () => {
  isLoading.value = true;
  getAllUsersLikes(currentUser.id)
  .then(async (result) => {
    totalLikes = result;
    isLoading.value = false;
  });
}

onBeforeMount(async () => {
  await LoadData();
})

</script>

<template>
  <div style="color: aquamarine; display: flex; justify-content: center;">
    Takto Vás uvidí ostatní uživatelé
  </div>

  <Divider></Divider>
  
  <BasicPageHeader text="Náhled profilu" backArrow></BasicPageHeader>

  <div style="position: relative; overflow-y: auto; height: calc(100vh - 235px);">
    <div style="margin-bottom: 20px;">
      <h2>
        {{ previewData.name }}
      </h2>
      <i>
        {{ previewData.bio }}
      </i>
    </div>

    <Divider></Divider>

    <h3 v-if="recipeCnt >= 5">{{ recipeCnt }} veřejných receptů</h3>
    <h3 v-else-if="recipeCnt >= 2">{{ recipeCnt }} veřejné recepty</h3>
    <h3 v-else-if="recipeCnt == 1">{{ recipeCnt }} veřejný recept</h3>
    <h3 v-else>Žádné veřejné recepty</h3> <!-- recipeCnt == 0 -->

    <div v-if="isLoading" style="text-align: center;">
      <h3 class="pi pi-spin pi-th-large"></h3>
    </div>

    <div v-else>
      <h3 v-if="totalLikes >= 5">{{ totalLikes }} kladně hodnocených receptů</h3>
      <h3 v-else-if="totalLikes >= 2">{{ totalLikes }} kladně hodnocené recepty</h3>
      <h3 v-else-if="totalLikes == 1">{{ totalLikes }} kladně hodnocený recept</h3>
      <h3 v-else>Dosud žádná hodnocení receptů</h3> <!-- totalLike == 0 -->
    </div>

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

  </div>


</template>
