<script setup>
import { useRouter } from "vue-router";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

</script>

<template> 
  <h2>Profil</h2>

  <div v-if="currentUser.id == 0">
    Pro zobrazení profilu se přihlaste.
  </div>

  <div v-else>
    <h3><i>{{ currentUser.name }}</i></h3>
    {{ currentUser.bio }}
  </div>

  <Button icon="pi pi-user" label="Přepnout uživatele" @click="router.push('/users')"></Button>
  <br/>
  <Button v-if="currentUser.id != 0" icon="pi pi-pencil" label="Upravit profil"
    @click="router.push('/profile/edit')">
  </Button>

</template>
