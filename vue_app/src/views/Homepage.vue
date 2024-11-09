<script setup>
import { switchUser } from "../../utils/users_api.js";
import { useRouter } from "vue-router";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

</script>

<template>
  <h2>Homepage</h2>

  <div v-if="currentUser.id == 0">
    <i>Nepřihlášený uživatel</i>
    <br/>
    <Button icon="pi pi-users" label="Uživatelé" @click="router.push('/users')"></button>
  </div>
  <div v-else>
    Aktuální uživatel: {{ currentUser.name }}
    <br/>
    <Button v-if="currentUser.id != 0" icon="pi pi-user" label="Profil" @click="router.push('/profile')"></button>
      <br/>
    <Button @click="switchUser(0)">Odhlásit</Button>
  </div>

</template>
