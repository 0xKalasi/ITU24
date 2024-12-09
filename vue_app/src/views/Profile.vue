<script setup>
import { useRouter } from "vue-router";

import { ref } from "vue";
import { updateUser } from "../../utils/users_api";

import { useUserStore, profilePreviewStore } from '../stores/userStore';
import ProfilePreview from "./ProfilePreview.vue";
const currentUser = useUserStore();
const previewData = profilePreviewStore();

const router = useRouter();

// Alerts:
const profileUpdated = ref(false);
const profileUpdatedKey = ref(0);
const emptyName = ref(false);
const emptyNameKey = ref(false);

const PrepareToUpdate = async() => {
  previewData.name = currentUser.name;
  previewData.bio = currentUser.bio;
  
  previewData.editMode = !previewData.editMode;
}

const UpdateProfile = async () => {
  if (previewData.name == "") {
    emptyName.value = true;
    emptyNameKey.value++;
  } else {
    profileUpdated.value = true;
    profileUpdatedKey.value++;
    updateUser(currentUser.id, previewData.name, previewData.bio);
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
    :key="profileUpdatedKey"
  />
  <Alert v-if="emptyName"
    type="warn"
    text="Není zadáno žádné jméno"
    :key="emptyNameKey"
  />

  <BasicPageHeader text="Profil"></BasicPageHeader>

  <div v-if="currentUser.id == 0">
    Pro zobrazení profilu se přihlaste.

    <Button
      icon="pi pi-user"
      label="Přepnout uživatele"
      @click="router.push('/users')"
      style="margin-top: 20px;">
    </Button>

  </div>

  <div v-else-if="previewData.editMode == false">

    <div style="gap: 10px">
      <Button
        icon="pi pi-user"
        label="Přepnout uživatele"
        @click="router.push('/users')">
      </Button>
      <Button v-if="currentUser.id != 0"
        icon="pi pi-pencil"
        label="Upravit profil"
        @click="PrepareToUpdate()">
      </Button>
    </div>

    <div class="devider" style="margin-top: 20px; margin-bottom: 20px;"></div>

    <h2><i>
      {{ currentUser.name }}
    </i></h2>
    {{ currentUser.bio }}

  </div>
  <div v-else>

    <div>
      <Button
        icon="pi pi-check"
        @click="UpdateProfile()">
      </Button>
      <Button
        icon="pi pi-times"
        severity="warn"
        @click="previewData.editMode = !previewData.editMode"
        style="margin-left: 10px;">
      </Button>
      <Button
        label="Zobrazit náhled" 
        icon="pi pi-question"
        @click="GoToPreview()"
        style="float: right">
      </Button>
    </div>

    <div class="devider" style="margin-top: 20px; margin-bottom: 20px;"></div>

    <h2><i>
      <input v-model="previewData.name"></input>
    </i></h2>

    <textarea v-model="previewData.bio" rows="5" cols="30"></textarea>
    <br/>

  </div>

</template>

<style scoped>
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>

