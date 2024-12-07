<script setup>
import { useRouter } from "vue-router";
import { acceptFriendRequest, readUsersBlocked } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";

import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const blockedUsers = ref([]);

let blockedUsersChanges;
onMounted(async () => {
  blockedUsers.value = await readUsersBlocked(currentUser.id);

  blockedUsersChanges = await createSubscription("UPDATE", "FriendStatus", async () => {
    blockedUsers.value = await readUsersBlocked(currentUser.id);
  });
});
onUnmounted(() => {
  removeSubscription(blockedUsersChanges);
});

</script>

<template>  
  <h2>Zablokovaní uživatelé</h2>

  <!--<Button label="Příchozí" icon="pi pi-clock" @click="router.push('/requests')"></Button>-->
  <!--<Button label="Přátelé" icon="pi pi-heart" @click="router.push('/chats')"></Button>-->

  <Button label="Zpět" icon="pi pi-arrow-left" @click="router.push('/chats')"></Button>
  <br/><br/>

  <div v-if="blockedUsers.length == 0">
    Seznam zablokovaných uživatelů je prázdný.
  </div>

  <div v-for="blocked in blockedUsers">
    <Message @click="router.push(`/profile/${blocked.id}`)" severity="secondary">
      {{ blocked.name }}
    </Message>
    <Button
      label="Odblokovat"
      icon="pi pi-lock-open"
      @click="acceptFriendRequest(currentUser.id, blocked.id)"
      style="float: right">
    </Button>
    <br/><br/>
  </div>

</template>
