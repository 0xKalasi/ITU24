<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore, profilePreviewStore } from '../stores/userStore';
const currentUser = useUserStore();
const previewData = profilePreviewStore();

import { readUsersPublicRecipe } from "../../utils/api";
import { updateUser } from "../../utils/users_api";

const usersRecipes = await readUsersPublicRecipe(currentUser.id);
const recipeCnt = usersRecipes.length;
const totalLikes = usersRecipes.reduce((total, recipe) => total + recipe.like_count, 0);

// Alerts:
const profileUpdated = ref(false);
const profileUpdatedKey = ref(0);
const emptyName = ref(false);
const emptyNameKey = ref(false);

const IsLoggedOut = computed (() => {
  return currentUser.id == 0;
});

const PrepareToUpdate = async () => {
  previewData.name = currentUser.name;
  previewData.bio = currentUser.bio;
  
  previewData.editMode = !previewData.editMode;
}

const ToggleEditMode = async () => {
  previewData.editMode = !previewData.editMode;
}

const GoToUserSelection = async () => {
  router.push("/users");
}

const UpdateProfile = async () => {
  if (previewData.name == "") {
    emptyName.value = true;
    emptyNameKey.value++;
  } else {
    profileUpdated.value = true;
    profileUpdatedKey.value++;
    await updateUser(currentUser.id, previewData.name, previewData.bio);
    previewData.editMode = !previewData.editMode;
  }
}

const GoToPreview = async () => {
  if (previewData.name == "") {
    emptyName.value = true;
    emptyNameKey.value++;
  } else {
    router.push(`/profile/preview`);
  }
}

</script>

<template> 
  <Alert v-if="profileUpdated"
    type="success" 
    text="Profil úspěšně upraven"
    :key="profileUpdatedKey">
  </Alert>
  <Alert v-if="emptyName"
    type="warn"
    text="Není zadáno žádné jméno"
    :key="emptyNameKey">
  </Alert>

  <BasicPageHeader text="Profil"></BasicPageHeader>

  <div v-if="IsLoggedOut">
    Pro zobrazení profilu se přihlaste.

    <Button
      icon="pi pi-user"
      label="Přepnout uživatele"
      @click="GoToUserSelection"
      style="margin-top: 20px;">
    </Button>

  </div>

  <div v-else-if=" ! previewData.editMode">

    <div style="display: flex; margin-bottom: 20px; gap: 10px">
      <Button
        icon="pi pi-user"
        label="Přepnout uživatele"
        @click="GoToUserSelection">
      </Button>
      <Button
        icon="pi pi-pencil"
        label="Upravit profil"
        @click="PrepareToUpdate">
      </Button>
    </div>

    <Divider></Divider>

    <h2>
      {{ currentUser.name }}
    </h2>
    <i>
      {{ currentUser.bio }}
    </i>

    <Divider style="margin-top: 20px;"></Divider>

    <h3 v-if="recipeCnt >= 5">{{ recipeCnt }} veřejných receptů</h3>
    <h3 v-else-if="recipeCnt >= 2">{{ recipeCnt }} veřejné recepty</h3>
    <h3 v-else-if="recipeCnt == 1">{{ recipeCnt }} veřejný recept</h3>
    <h3 v-else>Žádné veřejné recepty</h3> <!-- recipeCnt == 0 -->

    <h3 v-if="totalLikes >= 5">{{ totalLikes }} spokojených kuchařů</h3>
    <h3 v-else-if="totalLikes >= 2">{{ totalLikes }} spokojení kuchaři</h3>
    <h3 v-else-if="totalLikes == 1">{{ totalLikes }} spokojený kuchař</h3>
    <h3 v-else>Dosud žádná hodnocení receptů</h3> <!-- totalLike == 0 -->

    <Divider></Divider>

  </div>
  <div v-else> <!-- EDIT MODE -->

    <div style="margin-bottom: 20px;">
      <Button
        icon="pi pi-check"
        @click="UpdateProfile">
      </Button>
      <Button
        icon="pi pi-times"
        severity="warn"
        @click="ToggleEditMode"
        style="margin-left: 10px;">
      </Button>
      <Button
        label="Zobrazit náhled" 
        icon="pi pi-question"
        @click="GoToPreview"
        style="float: right">
      </Button>
    </div>

    <Divider></Divider>

    <div style="margin-bottom: 20px;">
      <InputText
        v-model="previewData.name"
        size="small"
        style="margin-top: 20px; margin-bottom: 20px;">
      </InputText>

      <Textarea
        v-model="previewData.bio"
        rows="5"
        cols="30"
        size="small">
      </Textarea>
    </div>

    <Divider></Divider>

    <h3 v-if="recipeCnt >= 5">{{ recipeCnt }} veřejných receptů</h3>
    <h3 v-else-if="recipeCnt >= 2">{{ recipeCnt }} veřejné recepty</h3>
    <h3 v-else-if="recipeCnt == 1">{{ recipeCnt }} veřejný recept</h3>
    <h3 v-else>Žádné veřejné recepty</h3> <!-- recipeCnt == 0 -->

    <h3 v-if="totalLikes >= 5">{{ totalLikes }} spokojených kuchařů</h3>
    <h3 v-else-if="totalLikes >= 2">{{ totalLikes }} spokojení kuchaři</h3>
    <h3 v-else-if="totalLikes == 1">{{ totalLikes }} spokojený kuchař</h3>
    <h3 v-else>Dosud žádná hodnocení receptů</h3> <!-- totalLike == 0 -->

    <Divider></Divider>

  </div>

</template>
