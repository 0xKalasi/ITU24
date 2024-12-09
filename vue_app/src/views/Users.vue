<script setup>
  import { readAllUsers, switchUser } from "../../utils/users_api.js";
  import { useRouter } from "vue-router";

  const router = useRouter();

  const users = await readAllUsers();

  const SwitchUser = async (id) => {
    await switchUser(id);
    router.push('/profile');
  }

</script>

<template>
  <h2>Uživatelé</h2>

  <table>
    <div v-for="user in users" style="display: flex" >
      <Message severity="secondary"
        @click="router.push(`/profile/${user.id}`)"
        style="margin: auto">
        {{ user.name }}
      </Message>
      <Button @click="SwitchUser(user.id)">Přihlásit</Button>
    </div>
  </table>
  <br/>
  <Button @click="switchUser(0); router.push('/profile')">Odhlásit</Button>

</template>
