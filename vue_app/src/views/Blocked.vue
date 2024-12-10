<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readUsersBlocked, unblockUser } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";


const blockedUsers = ref([]);

let blockedUsersChanges;
onMounted(async () => {
  blockedUsers.value = await readUsersBlocked(currentUser.id);

  blockedUsersChanges = await createSubscription("UPDATE", "FriendStatus", async () => {
    blockedUsers.value = await readUsersBlocked(currentUser.id);
  });
});
onUnmounted(async () => {
  await removeSubscription(blockedUsersChanges);
});

const GoToProfile = async (id) => {
  router.push(`/profile/${id}`);
}

const UnBlock = async (id) => {
  unblockUser(currentUser.id, id);
}

</script>

<template>  
  <BasicPageHeader text="Zablokovaní uživatelé"></BasicPageHeader>

  <div v-if="blockedUsers.length == 0">
    Seznam zablokovaných uživatelů je prázdný.
  </div>

  <div v-for="blocked in blockedUsers">
    <Message
      @click="GoToProfile(blocked.id)"
      severity="secondary"
      style="margin-bottom: 5px">
      {{ blocked.name }}
    </Message>

    <Button
      label="Odblokovat"
      icon="pi pi-lock-open"
      @click="UnBlock(blocked.id)"
      style="margin-bottom: 20px; margin-left: 50vw;">
    </Button>
  </div>

</template>
