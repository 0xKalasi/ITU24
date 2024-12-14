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

const IsLoggedOut = computed (() => {
  return currentUser.id == 0;
});

const StartEditMode = async () => {
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

const isInvalid = ref(false);

const UpdateProfile = async () => {
  if (previewData.name != "") {
    await updateUser(currentUser.id, previewData.name, previewData.bio);
    profileUpdated.value = true;
    profileUpdatedKey.value++;
    
    previewData.editMode = !previewData.editMode;
  } else {
    isInvalid.value = true;
  }
}

const SetValid = () => {
  isInvalid.value = false;
}

const GoToPreview = async () => {
  if (previewData.name != "") {
    isInvalid.value = false;
    router.push(`/profile/preview`);
  } else {
    isInvalid.value = true;
  }
}

</script>

<template> 
  <Alert v-if="profileUpdated"
    type="success" 
    text="Profil úspěšně upraven"
    :key="profileUpdatedKey">
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

    <div style="position: relative; overflow-y: auto; height: calc(100vh - 220px);">
      <div style="display: flex; margin-bottom: 20px; gap: 10px">
        <Button
          icon="pi pi-user"
          label="Přepnout uživatele"
          @click="GoToUserSelection">
        </Button>
        <Button
          icon="pi pi-pencil"
          label="Upravit profil"
          @click="StartEditMode"
          style="margin-left: auto;">
        </Button>
      </div>

      <Divider></Divider>

      <h2>
        {{ currentUser.name }}
      </h2>
      <i>
        {{ currentUser.bio }}
      </i>

      <Divider style="margin-top: 20px; margin-bottom: 20px"></Divider>

      <div @click="router.push('/recipes')">
        <Message v-if="recipeCnt >= 5"
          severity="contrast"
          variant="outlined"
          size="large">
          <b>{{ recipeCnt }}</b> veřejných receptů
        </Message>
        <Message v-else-if="recipeCnt >= 2"
          severity="contrast"
          variant="outlined"
          size="large">
          <b>{{ recipeCnt }}</b> veřejné recepty
        </Message>
        <Message v-else-if="recipeCnt == 1"
          severity="contrast"
          variant="outlined"
          size="large">
          <b>{{ recipeCnt }}</b> veřejný recept
        </Message>
        <Message v-else
          severity="contrast"
          variant="outlined"
          size="large"> <!-- recipeCnt == 0 -->
          Žádné veřejné recepty
        </Message>
      </div>

      <h3 v-if="totalLikes >= 5">{{ totalLikes }} kladně hodnocených receptů</h3>
      <h3 v-else-if="totalLikes >= 2">{{ totalLikes }} kladně hodnocené recepty</h3>
      <h3 v-else-if="totalLikes == 1">{{ totalLikes }} kladně hodnocený recept</h3>
      <h3 v-else>Dosud žádná hodnocení receptů</h3> <!-- totalLike == 0 -->

      <Divider></Divider>
    </div>

  </div>

  <!-- EDIT MODE -->

  <div v-else>

    <div style="margin-bottom: 20px;">
      <Button
        icon="pi pi-check"
        @click="UpdateProfile">
      </Button>
      <Button
        icon="pi pi-times"
        @click="ToggleEditMode"
        style="margin-left: 10px; background: crimson; border: 1px solid crimson;">
      </Button>
      <Button
        label="Zobrazit náhled" 
        icon="pi pi-question"
        @click="GoToPreview"
        style="float: right">
      </Button>
    </div>

    <div style="position: relative; overflow-y: auto; height: calc(100vh - 280px);">
      <Divider></Divider>

      <div style="margin-bottom: 20px; margin-top: 20px;">
        <div>
          <InputText
            v-model="previewData.name"
            size="small"
            placeholder="Uživatelské jméno"
            :invalid="isInvalid"
            @input="SetValid">
          </InputText>
          <Message
            v-if="isInvalid"
            variant="simple"
            severity="error"
            size="small">
            Není zadáno žádné uživatelské jméno
          </Message>
        </div>

        <div>
          <Textarea
            v-model="previewData.bio"
            rows="5"
            cols="30"
            size="small"
            placeholder="Popisek"
            style="margin-top: 20px">
          </Textarea>
        </div>
      </div>

      <Divider></Divider>

      <h3 v-if="recipeCnt >= 5">{{ recipeCnt }} veřejných receptů</h3>
      <h3 v-else-if="recipeCnt >= 2">{{ recipeCnt }} veřejné recepty</h3>
      <h3 v-else-if="recipeCnt == 1">{{ recipeCnt }} veřejný recept</h3>
      <h3 v-else>Žádné veřejné recepty</h3> <!-- recipeCnt == 0 -->

      <h3 v-if="totalLikes >= 5">{{ totalLikes }} kladně hodnocených receptů</h3>
      <h3 v-else-if="totalLikes >= 2">{{ totalLikes }} kladně hodnocené recepty</h3>
      <h3 v-else-if="totalLikes == 1">{{ totalLikes }} kladně hodnocený recept</h3>
      <h3 v-else>Dosud žádná hodnocení receptů</h3> <!-- totalLike == 0 -->

      <Divider></Divider>

    </div>

  </div>

</template>
