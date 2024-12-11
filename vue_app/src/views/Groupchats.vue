<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readUsersGroupchats, createGroupchat } from "../../utils/groupchat_api";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";

const groupchats = ref([]);

let groupsChanges;
onMounted(async () => {
  groupchats.value = await readUsersGroupchats(currentUser.id);

  groupsChanges = await createSubscription("*", "GroupchatMembers", async () => {
    groupchats.value = await readUsersGroupchats(currentUser.id);
  });
});
onUnmounted(async () => {
  await removeSubscription(groupsChanges);
});

const createGroup = ref(false);
const newGroupName = ref("");

// Alert:
const emptyName = ref(false);
const emptyNameKey = ref(false);

const IsLoggedOut = computed (() => {
  return currentUser.id == 0;
});

const CreateNewGroupchat = async () => {
  if (newGroupName.value != "") {
    await createGroupchat(newGroupName.value);

    newGroupName.value = "";
    createGroup.value = !createGroup.value;
  } else {
    emptyName.value = true;
    emptyNameKey.value++;
  }
}

const GoToChats = async () => {
  router.push("/chats");
}

const GoToGroupchat = async (id) => {
  router.push(`/groupchats/${id}`);
}

const ToggleCreationOption = async () => {
  createGroup.value = !createGroup.value;
}

</script>

<template>
  <Alert v-if="emptyName"
    type="warn"
    text="Není zadáno žádné jméno skupiny"
    :key="emptyNameKey"
  />

  <BasicPageHeader text="Skupiny"></BasicPageHeader>

  <div v-if="IsLoggedOut">
    Pro zobrazení skupin se přihlaste.
  </div>

  <div v-else>

    <Button
      label="Přátelé"
      icon="pi pi-comment"
      @click="GoToChats"
      style="margin-bottom: 20px;">
    </Button>

    <Divider></Divider>

    <div v-if="groupchats.length == 0">
      <div style="margin-top: 20px; margin-bottom: 20px;">
        Nejste členem žádné skupiny.
      </div>
      <Divider></Divider>
    </div>

    <div v-for="groupchat in groupchats">
      <div style="display: flex; align-items: center;">
        <h3>{{ groupchat.name }}</h3>
        <!-- TODO MEMBER COUNT -->

        <Button
          label="Otevřít"
          icon="pi pi-comments"
          @click="GoToGroupchat(groupchat.id)"
          style="margin-left: auto">
        </Button>
      </div>

      <Divider></Divider>
    </div>

    <Button
      v-if=" ! createGroup"
      label="Vytvořit skupinu"
      icon="pi pi-plus"
      @click="ToggleCreationOption"
      style="float: right; margin-top: 20px;">
    </Button>

    <div v-else>
      <InputText
        v-model="newGroupName"
        style="margin-top: 20px; margin-bottom: 20px;" size="small"
        @keydown.enter="CreateNewGroupchat"
      />

      <Button
        icon="pi pi-check"
        @click="CreateNewGroupchat"
        style="transform: translate(50%, 0); align-items: center;">
      </Button>

      <Divider></Divider>

      <Button
        label="Zrušit"
        icon="pi pi-times"
        @click="ToggleCreationOption"
        style="float: right; margin-top: 20px;">
      </Button>
    </div>

  </div>  

</template>
