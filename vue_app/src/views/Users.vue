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

  <div style="position: relative; overflow-y: auto; height: calc(100vh - 210px);">
    <table>
      <div
        v-for="u in users"
        style="display: flex; width: 100%; gap: 10px; margin-bottom: 5px">
        <Message
          severity="secondary"
          @click="GoToProfile(u.id)"
          style="flex-grow: 1;">
          {{ u.name }}
        </Message>

        <Button 
          label="Přihlásit"
          @click="SwitchUser(u.id)">
        </Button>
      </div>
    </table>

    <br/>

    <Button 
      v-if="user.id" 
      label="Odhlásit"
      @click="user.logout">
    </Button>

  </div>

</template>
