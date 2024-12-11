<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

import { readAllUsers, switchUser } from "../../utils/users_api.js";

const users = await readAllUsers();

const SwitchUser = async (id) => {
  await switchUser(id);
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
      v-for="user in users"
      style="display: flex">
      <Message
        severity="secondary"
        @click="GoToProfile(user.id)"
        style="margin: auto">
        {{ user.name }}
      </Message>

      <Button @click="SwitchUser(user.id)">
        Přihlásit
      </Button>
    </div>
  </table>

  <br/>

  <Button @click="SwitchUser(0)">
    Odhlásit
  </Button>

</template>
