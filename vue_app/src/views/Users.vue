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
  <BasicPageHeader text="Uživatelé"></BasicPageHeader>

  <table>
    <div
      v-for="u in users"
      style="display: flex">
      <Message
        severity="secondary"
        @click="GoToProfile(u.id)"
        style="margin: auto">
        {{ u.name }}
      </Message>

      <Button @click="SwitchUser(u.id)">
        Přihlásit
      </Button>
    </div>
  </table>

  <br/>

  <Button v-if="user.id" @click="user.logout">
    Odhlásit
  </Button>

</template>
