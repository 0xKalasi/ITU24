<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();


import { readUser, blockUser, setLastTimeSeenForChat } from "../../utils/users_api";


const peerUserId = router.currentRoute.value.params.user_id;
const peerUser = await readUser(peerUserId);


const BlockUser = async () => {
  await blockUser(currentUser.id, peerUser.id);
  router.push("/chats");
}

const GoToUser = async () => {
  router.push(`/profile/${peerUser.id}`);
}

const menu = ref();
const items = ref([
  {
    label: `${peerUser.name}`,
    items: [
      {
        label: "Zobrazit profil",
        icon: "pi pi-user",
        command: GoToUser
      }
    ]
  },
  {
    label: "Možnosti chatu",
    items: [
      {
        label: "Zablokovat uživatele",
        icon: "pi pi-lock",
        command: BlockUser
      }
    ]
  }
]);

const ToggleMenu = (event) => {
  menu.value.toggle(event);
}

// We store the fact that the chat was opened
onUnmounted(async () => {
  await setLastTimeSeenForChat(currentUser.id, peerUser.id);
});

const isLoading = ref(false);

</script>

<template>  
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>
    <div style="position: relative; display: flex; align-items: center; min-width: 320px;">
      <BasicPageHeader :text="`${peerUser.name}`"></BasicPageHeader>

      <div>
        <Button 
          type="button"
          icon="pi pi-ellipsis-h"
          rounded
          @click="ToggleMenu"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);">
        </Button>
        <Menu
          ref="menu"
          id="overlay_menu"
          :model="items"
          :popup="true">
        </Menu>
      </div>

    </div>

    <Divider style="margin-top: 10px;"></Divider>

    <ChatComp></ChatComp>

  </div>

</template>
