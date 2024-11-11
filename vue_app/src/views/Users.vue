<script setup>
  import { readAllUsers, switchUser } from "../../utils/users_api.js";
  import { useRouter } from "vue-router";
  import { useUserStore } from '../stores/userStore';
  const currentUser = useUserStore();

  const router = useRouter();

  const users = await readAllUsers();

</script>

<template>
  <!--<Button label="Zpět" @click="router.back()"></Button>-->
  <h2>Uživatelé</h2>

  <table>
    <div v-for="user in users" style="display: flex" >
      <Message severity="secondary"
        @click="router.push(`/profile/${user.id}`)"
        style="margin: auto">
        {{ user.name }}
      </Message>
      <Button @click="switchUser(user.id); router.push('/profile')">Přihlásit</Button>
    </div>
  </table>
  <br/>
  <Button @click="switchUser(0); router.push('/profile')">Odhlásit</Button>

</template>
