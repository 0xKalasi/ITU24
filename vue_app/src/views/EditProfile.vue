<script setup>
import { useRouter } from "vue-router";
import { updateUser } from "../../utils/users_api.js";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const newName = currentUser.name;
const newBio = currentUser.bio;

const router = useRouter();

// redirect in case of manual access to /profile/edit
if (currentUser.id == 0) { // TODO is this ok?? // when manually going to /profile when logged out, back button gets stuck in a loop
  router.push('/users');
}

</script>

<template>
  <h2>Edit Profile</h2>

  <p>Uživatelské jméno:</p>
  <input v-model="newName"></input>

  <p>Popisek profilu:</p>
  <textarea v-model="newBio" rows="5" cols="30"></textarea>
  <br/>
  
  <Button label="Potvrdit Úpravy" icon="pi pi-check"
    @click="updateUser(currentUser.id, newName, newBio); router.push('/profile')">
  </Button>
  <br/>
  <Button label="Zobrazit náhled" icon="pi pi-question"
    @click="console.log('PREVIEW')">
  </Button>

</template>
