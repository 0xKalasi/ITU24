<script setup>
import { useRouter } from "vue-router";
import { updateUser } from "../../utils/users_api.js";

import { useUserStore, profilePreviewStore } from '../stores/userStore';
import BasicPageHeader from "../components/basicPageHeader.vue";

const currentUser = useUserStore();
const previewData = profilePreviewStore();

const router = useRouter();

// TODO DEBUG !!!

</script>

<template>
  <BasicPageHeader text="Úprava profilu"></BasicPageHeader>

  <p>Uživatelské jméno:</p>
  <input v-model="previewData.name"></input>

  <p>Popisek profilu:</p>
  <textarea v-model="previewData.bio" rows="5" cols="30"></textarea>
  <br/>
  
  <Button label="Potvrdit Úpravy" icon="pi pi-check"
    @click="updateUser(currentUser.id, previewData.name, previewData.bio);router.push('/profile');">
  </Button>
  <br/>
  <Button label="Zobrazit náhled" icon="pi pi-question"
    @click="router.push(`/profile/edit/preview`)">
  </Button>

</template>
