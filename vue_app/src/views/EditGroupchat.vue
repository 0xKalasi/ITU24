<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();


import { 
  readGroupchat,
  updateGroupName,
  readGroupchatMembers,
  removeUserFromGroup,
  deleteGroupchatMessages,
  deleteGroupchat
} from "../../utils/groupchat_api";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";


const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);

const members = ref([]);

let memberChanges;
onMounted(async () => {
  members.value = await readGroupchatMembers(currentGroup.id);

  memberChanges = await createSubscription("*", "GroupchatMembers", async () => {
    members.value = await readGroupchatMembers(currentGroup.id);
  });
});
onUnmounted(async () => {
  await removeSubscription(memberChanges);
});

const isCreator = (currentUser.id == currentGroup.creator) ? true : false;

const groupName = ref(currentGroup.name);
const confirmDelHist = ref(false);
const confirmDelGroup = ref(false);
const confirmLeaveGroup = ref(false);

// Alert detection:
const nameChanged = ref(false);
const nameChangedKey = ref(0);
const emptyName = ref(false);
const emptyNameKey = ref(0);

const Rename = async () => {
  if (groupName.value == "") {
    emptyName.value = true;
    emptyNameKey.value++;
  } else {
    nameChanged.value = true;
    nameChangedKey.value++;
    await updateGroupName(currentGroup.id, groupName.value)
  }
}


const GoToAddMembers = async () => {
  router.push(`/groupchats/add/${currentGroup.id}`)
}

const RemoveUser = async (id) => {
  await removeUserFromGroup(id, currentGroup.id);
}

const AskDeleteHistory = async () => {
  confirmDelHist.value = true;
}
const CancelDeleteHistory = async () => {
  confirmDelHist.value = false;
}
const DeleteHistory = async () => {
  await deleteGroupchatMessages(currentGroup.id);
  confirmDelHist.value = false;
}

const CancelDeleteGroup = async () => {
  confirmDelGroup.value = false;
}
const AskDeleteGroup = async () => {
  confirmDelGroup.value = true;
}
const DeleteGroupchat = async () => {
  await deleteGroupchat(currentGroup.id);
  router.push("/chats");
}

</script>

<template>
  <Alert
    v-if="nameChanged"
    type="success" 
    text="Jméno skupiny změněno."
    :key="nameChangedKey">
  </Alert>
  <Alert
    v-if="emptyName"
    type="warn"
    text="Chybí jméno skupiny."
    :key="emptyNameKey">
  </Alert>

  <BasicPageHeader text="Spravovat skupinu">
  </BasicPageHeader>

  <div>

    <!-- CREATOR VIEW -->

    <div v-if="isCreator" style="position: relative; overflow-y: auto; height: calc(100vh - 220px);">
      <Divider></Divider>

      <!-- RENAME -->
      <div
        style="display: flex; align-items: center; margin-top: 20px; margin-bottom: 20px;">
        <InputText
          v-model="groupName"
          size="small"
          @keydown.enter="Rename">
        </InputText>
        <Button
          icon="pi pi-pencil"
          @click="Rename"
          style="transform: translate(50%, 0);">
        </Button>
      </div>

      <!-- DELETE FEATURES -->

      <!-- Default view -->
      <div
        v-if="( ! confirmDelHist) && ( ! confirmDelGroup)"
        style="margin-bottom: 10px; display: flex; gap: 10px">

        <Button
          label="Smazat historii zpráv"
          icon="pi pi-history"
          severity="warn"
          @click="AskDeleteHistory">
        </Button>
        <Button
          label="Odstranit skupinu"
          icon="pi pi-exclamation-circle"
          @click="AskDeleteGroup"
          style="background: crimson; border: 1px solid crimson;">
        </Button>
      </div>

      <!-- History deletion confirmation -->
      <div v-else-if="confirmDelHist">
        <div style="color: red; margin-top: 10px;">
          Tato akce je nevratná, skutečně chcete smazat historii zpráv?
        </div>

        <div style="margin-top: 20px; margin-bottom: 20px; display: flex; gap: 10px">
          <Button
            icon="pi pi-check"
            label="Ano, smazat historii"
            @click="DeleteHistory"
            style="background: crimson; border: 1px solid crimson; flex: 1;">
          </Button>
          <Button
            icon="pi pi-times"
            label="Ne, ponechat historii"
            style="flex: 1;"
            @click="CancelDeleteHistory">
          </Button>
        </div>
      </div>

      <!-- Whole group deletion confirmation -->
      <div v-else-if="confirmDelGroup">
        <div style="color: red; margin-top: 10px;">
          Skutečně chcete smazat skupinu? Tato akce je nevratná.
        </div>

        <div style="margin-top: 20px; margin-bottom: 20px; display: flex; gap: 10px;">
          <Button
            icon="pi pi-check"
            label="Ano, smazat"
            @click="DeleteGroupchat"
            style="background: crimson; border: 1px solid crimson; flex: 1;">
          </Button>
          <Button
            icon="pi pi-times"
            label="Ne, nemazat"
            @click="CancelDeleteGroup"
            style="flex: 1;">
          </Button>
        </div>

      </div>

      <!-- MEMBER MANAGMENT -->

      <div style="display: flex; align-items: center; gap: 20px;">
        <h3>Členové</h3>

        <div style="display: flex; flex: 1; justify-content: end;">
          <Button
            label="Přidat členy"
            icon="pi pi-plus"
            @click="GoToAddMembers">
          </Button>
        </div>
      </div>

      <Divider></Divider>

      <div
        v-for="member in members"
        style="margin-top: 10px">

        <div style="margin-bottom: 10px; display: flex; align-items: center;">
          -> {{ member.name }}

          <div style="display: flex; flex: 1; justify-content: end;">
            <Button
              v-if="member.id != currentUser.id"
              icon="pi pi-minus"
              style="background: crimson; border: 1px solid crimson;"
              @click="RemoveUser(member.id)">
            </Button>
            <Button
              v-else
              severity="secondary"
              label="Tvůrce"
              style="pointer-events: none;">
            </Button>
          </div>
        </div>

      </div>
      
      <Divider></Divider>

    </div>

      <!-- MEMBER VIEW -->

    <div v-else>
      <!-- THIS PART WAS REPLACED BY A SUBMENU FOR USERS OPTIONS -->
      <!-- It is left here for completeness and as a safeguard, a non-creator, cannot edit the group on this page -->

    </div>

  </div>

</template>
