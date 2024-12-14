<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();


import { readGroupchat, removeUserFromGroup, setLastTimeSeenForGroupchat } from "../../utils/groupchat_api";


const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);


const truncateStr = computed(() => (str, max) => {
  if (str.length > max) {
    return str.substring(0, max - 3) + "...";
  } else {
    return str;
  }
});

const IsCreator = computed(() => {
  return (currentUser.id == currentGroup.creator) ? "pi pi-pencil" : "pi pi-ellipsis-h";
});

const GoToEdit = async () => {
  router.push(`/groupchats/edit/${currentGroup.id}`);
}

const LeaveGroup = async () => {
  await removeUserFromGroup(currentUser.id, currentGroup.id);
  router.push("/chats");
}

const GoToAddMembers = async () => {
  router.push(`/groupchats/add/${currentGroup.id}`)
}

const menu = ref();
const items_creator = ref([
  {
    label: "Možnosti skupiny",
    items: [
      {
        label: "Spravovat skupinu",
        icon: "pi pi-hammer",
        command: GoToEdit
      }
    ]
  }
]);
const items_member = ref([
  {
    label: `${currentGroup.name}`,
    items: [
      {
        label: "Přidat členy",
        icon: "pi pi-users",
        command: GoToAddMembers
      },
      {
        label: "Opustit skupinu",
        icon: "pi pi-arrow-left",
        command: LeaveGroup
      }
    ]
  }
]);

const ToggleMenu = (event) => {
  menu.value.toggle(event);
}

const ChooseMenuContent = computed(() => {
  return (currentUser.id == currentGroup.creator) ? items_creator.value : items_member.value;
});

onUnmounted(async () => {
  await setLastTimeSeenForGroupchat(currentGroup.id, currentUser.id);
});

const isLoading = ref(false);

</script>

<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>
    <div style="position: relative; display: flex; align-items: center; min-width: 320px;">
      <BasicPageHeader :text="truncateStr(currentGroup.name, 16)"></BasicPageHeader>

      <div>
        <Button 
          type="button"
          :icon="IsCreator"
          rounded
          @click="ToggleMenu"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);">
        </Button>
        <Menu
          ref="menu"
          id="overlay_menu"
          :model="ChooseMenuContent"
          :popup="true">
        </Menu>
      </div>
    </div> 

    <Divider style="margin-bottom: 0px; margin-top: 10px;"></Divider>

    <GroupchatComp></GroupchatComp>

  </div>

</template>
