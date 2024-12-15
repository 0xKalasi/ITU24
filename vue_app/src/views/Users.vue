<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const user = useUserStore();


import { readAllUsers } from "../../utils/users_api.js";


const users = await readAllUsers();

const SwitchUser = async (id) => {
  await user.login(id);
  router.push("/profile");
}

const GoToProfile = async (id) => {
  router.push(`/profile/${id}`);
}
</script>

<template>
  <BasicPageHeader text="Uživatelé" backArrow />

  <div style="display: flex;flex-direction: column;justify-content: space-between; gap: 10px;">
    <div v-for="u in users">
      <Message
        severity="secondary"
        @click="GoToProfile(u.id)"
        style="width: 100%; position: relative; cursor: pointer;">
        {{ u.name }}
        <Button @click="SwitchUser(u.id)" style="position: absolute; right: 2px; bottom: 50%; transform: translateY(50%);">
          Přihlásit
        </Button>
      </Message>

    </div>
  </div>

  <Button v-if="user.id" @click="user.logout" severity="danger" style="margin-top: 16px;">
    Odhlásit
  </Button>

</template>
