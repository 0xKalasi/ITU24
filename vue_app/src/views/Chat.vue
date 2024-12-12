<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onBeforeMount } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readUser, deleteChatHistory } from "../../utils/users_api";


const peerUserId = router.currentRoute.value.params.user_id;
const peerUser = await readUser(peerUserId);

const DeleteHistory = async () => {
  await deleteChatHistory(currentUser.id, peerUser.id);
}


const isLoading = ref(false);

</script>

<template>  
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>
    <div style="position: relative; display: flex; align-items: center; min-width: 320px;">
      <BasicPageHeader :text="`${peerUser.name}`"></BasicPageHeader>

      <Button
        label="Smazat historii"
        icon="pi pi-history"
        size="small"
        @click="DeleteHistory"
        style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);">
      </Button>
    </div>

    <Divider style="margin-bottom: 0px; margin-top: 10px;"></Divider>

    <ChatComp></ChatComp>

  </div>

</template>
