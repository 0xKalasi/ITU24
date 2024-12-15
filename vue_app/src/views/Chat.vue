<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

// Needed for confirm dialog
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();


import { readUser, blockUser, setLastTimeSeenForChat } from "../../utils/users_api";


const peerUserId = router.currentRoute.value.params.user_id;
const peerUser = await readUser(peerUserId);


const truncateStr = computed(() => (str, max) => {
  if (str.length > max) {
    return str.substring(0, max - 3) + "...";
  } else {
    return str;
  }
});


const BlockUser = async () => {
  await blockUser(currentUser.id, peerUser.id);
  router.push("/chats");
}

const ConfirmBlockUser = async () => {
  confirm.require({
    message: `Opravdu chcete uživatele ${peerUser.name} zablokovat?`,
    header: "Potvrďte akci",
    icon: "pi pi-question",
    rejectProps: {
      label: "Ano, zablokovat",
      severity: "danger"
    },
    acceptProps: {
      label: "Ne, ponechat"
    },
    accept: () => {},
    reject: await BlockUser
  });
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
        command: ConfirmBlockUser
      }
    ]
  }
]);

const ToggleMenu = (event) => {
  menu.value.toggle(event);
}

// Updating last time viewed is only when closing the chat, otherwise incoming messages would not be seen
onUnmounted(async () => {
  await setLastTimeSeenForChat(currentUser.id, peerUser.id);
});

const isLoading = ref(false);

</script>

<template>  
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>
    <div style="position: relative; display: flex; align-items: center; min-width: 320px;">

      <BasicPageHeader :text="truncateStr(peerUser.name, 16)"></BasicPageHeader>

      <ConfirmDialog style="width: 300px"></ConfirmDialog>

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
