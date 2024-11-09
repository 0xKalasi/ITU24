<script setup>
import { useRouter } from "vue-router";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

// redirect in case of manual access to /profile
if (currentUser.id == 0) { // TODO is this ok?? // when manually going to /profile when logged out, back button gets stuck in a loop
  router.push('/users');
}

</script>

<template>
  <Button label="Zpět" @click="router.back()"></Button>
  
  <h2>Profile</h2>
  <h3>{{ currentUser.name }}</h3>
  {{ currentUser.bio }}
  <br/><br/>

  <Button icon="pi pi-inbox" label="Moje recepty" @click="router.push('/profile/recipes')"></Button>
  <br/>
  <Button icon="pi pi-pencil" label="Upravit profil" @click="router.push('/profile/edit')"></Button>

</template>
