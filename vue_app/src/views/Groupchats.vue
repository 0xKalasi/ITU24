<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';

import { readUsersGroupchats, createGroupchat } from "../../utils/groupchat_api";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";

import { ref, onMounted, onUnmounted } from "vue";

const currentUser = useUserStore();

const router = useRouter();

const groupchats = ref([]);

let groupsChanges;
onMounted(async () => {
  groupchats.value = await readUsersGroupchats(currentUser.id);

  groupsChanges = await createSubscription("*", "GroupchatMembers", async () => {
    groupchats.value = await readUsersGroupchats(currentUser.id);
  });
});
onUnmounted(() => {
  removeSubscription(groupsChanges);
});

const createGroup = ref(true);
const newGroupName = ref("");

// Alert:
const emptyName = ref(false);
const emptyNameKey = ref(false);

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

</script>

<template>
  <Alert v-if="emptyName"
    type="warn"
    text="Není zadáno žádné jméno skupiny"
    :key="emptyNameKey"
  />

  <BasicPageHeader text="Skupiny"></BasicPageHeader>

  <div v-if="currentUser.id == 0">
    Pro zobrazení skupin se přihlaste.
  </div>

  <div v-else>

    <Button
      label="Přátelé"
      icon="pi pi-comment"
      @click="router.push(`/chats`)"
      style="margin-bottom: 20px;">
    </Button>

    <div class="devider"></div>

    <div v-if="groupchats.length == 0">
      Nejste členem žádné skupiny.
      <div class="devider" style="margin-top: 20px"></div>
    </div>

    <div v-for="groupchat in groupchats">
      <div style="display: flex; align-items: center;">
        <h3>{{ groupchat.name }}</h3>
        <!-- TODO MEMBER COUNT -->

        <Button
          label="Otevřít"
          icon="pi pi-comments"
          @click="router.push(`/groupchats/${groupchat.id}`)"
          style="margin-left: auto">
        </Button>
      </div>

      <div class="devider"></div>
    </div>

    <Button
      v-if="createGroup == true"
      label="Vytvořit skupinu"
      icon="pi pi-plus"
      @click="createGroup = !createGroup"
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

      <div class="devider"></div>

      <Button
        label="Zrušit"
        icon="pi pi-times"
        @click="createGroup = !createGroup"
        style="float: right; margin-top: 20px;">
      </Button>
    </div>

  </div>  

</template>

<style scoped>
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>

