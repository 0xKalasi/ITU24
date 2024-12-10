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

const AskLeaveGroup = async () => { confirmLeaveGroup.value = true; }
const CancelLeaveGroup = async () => { confirmLeaveGroup.value = false; }
const LeaveGroup = async () => {
  await removeUserFromGroup(currentUser.id, currentGroup.id);
  router.push("/groupchats");
}

const GoToAddMembers = async () => {
  router.push(`/groupchats/add/${currentGroup.id}`)
}

const RemoveUser = async (id) => {
  await removeUserFromGroup(id, currentGroup.id);
}

const AskDeleteHistory = async () => { confirmDelHist.value = true; }
const CancelDeleteHistory = async () => { confirmDelHist.value = false; }
const DeleteHistory = async () => {
  await deleteGroupchatMessages(currentGroup.id);
  confirmDelHist.value = false;
}

const CancelDeleteGroup = async () => { confirmDelGroup.value = false; }
const AskDeleteGroup = async () => { confirmDelGroup.value = true; }
const DeleteGroupchat = async () => {
  await deleteGroupchat(currentGroup.id);
  router.push("/groupchats");
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

  <BasicPageHeader text="Spravovat skupinu"></BasicPageHeader>
  <Divider></Divider>

  <div
    v-if="currentUser.id == 0"
    style="margin-top: 20px">
    Pro zobrazení správy skupiny musíte být přihlášeni.
  </div>

  <!-- CREATOR VIEW -->
  <div v-else-if="isCreator">
    <!-- Rename -->
    <div
      style="display: flex; align-items: center; margin-top: 20px; margin-bottom: 20px; gap: 20px;">
      <InputText
        v-model="groupName"
        size="small"
        @keydown.enter="Rename">
      </InputText>
      <Button
        icon="pi pi-pencil"
        @click="Rename">
      </Button>
    </div>

    <Divider></Divider>

    <!-- Delete features -->
    <div
      v-if="( ! confirmDelHist) && ( ! confirmDelGroup)"
      style="margin-top: 20px; margin-bottom: 20px; display: flex; gap: 10px">

      <Button
        label="Smazat historii zpráv"
        icon="pi pi-history"
        severity="warn"
        @click="AskDeleteHistory">
      </Button>
      <Button
        label="Odstranit skupinu"
        icon="pi pi-exclamation-circle"
        severity="danger"
        @click="AskDeleteGroup">
      </Button>
    </div>

    <div v-else-if="confirmDelHist">
      <div style="color: red; margin-top: 10px;">
        Tato akce je nevratná, skutečně chcete smazat historii zpráv?
      </div>

      <div style="margin-top: 20px; margin-bottom: 20px; display: flex; gap: 10px">
        <Button
          icon="pi pi-check"
          label="Ano, smazat historii"
          severity="danger"
          @click="DeleteHistory">
        </Button>
        <Button
          icon="pi pi-times"
          label="Ne, ponechat historii"
          @click="CancelDeleteHistory">
        </Button>
      </div>
    </div>

    <div v-else-if="confirmDelGroup">
      <div style="color: red; margin-top: 10px;">
        Skutečně chcete smazat skupinu? Tato akce je nevratná.
      </div>

      <div style="margin-top: 20px; margin-bottom: 20px; display: flex; gap: 10px">
        <Button
          icon="pi pi-check"
          label="Ano, smazat"
          severity="danger"
          @click="DeleteGroupchat">
        </Button>
        <Button
          icon="pi pi-times"
          label="Ne, nemazat"
          @click="CancelDeleteGroup">
        </Button>
      </div>

    </div>

    <Divider></Divider>

    <!-- Member managment -->
    <div style="display: flex; align-items: center; gap: 20px;">
      <h3>Členové</h3>

      <Button
        label="Přidat členy"
        icon="pi pi-plus"
        @click="GoToAddMembers">
      </Button>
    </div>

    <div v-for="member in members">
      -> {{ member.name }}

      <Button
        v-if="member.id != currentUser.id"
        icon="pi pi-minus"
        style="margin-left: 10px;"
        @click="RemoveUser(member.id)">
      </Button>
      <Button
        v-else
        severity="secondary"
        label="Tvůrce"
        style="margin-left: 10px;">
      </Button>
    </div>

  </div>

  <!-- MEMBER VIEW -->
  <div v-else>

    <!-- Leave group -->
    <div v-if=" ! confirmLeaveGroup">
      <Button
        icon="pi pi-times"
        label="Opustit skupinu"
        severity="danger"
        @click="AskLeaveGroup"
        style="margin-top: 10px; margin-bottom: 10px;">
      </Button>

    </div>

    <div v-else>
      <div style="color: red; margin-top: 10px;">
        Skutečně chcete opustit skupinu?
      </div>

      <div style="margin-top: 20px; margin-bottom: 20px; display: flex; gap: 10px">
        <Button
          icon="pi pi-check"
          label="Ano, opustit skupinu"
          severity="danger"
          @click="LeaveGroup">
        </Button>
        <Button
          icon="pi pi-times"
          label="Ne, neopouštět"
          @click="CancelLeaveGroup">
        </Button>
      </div>

    </div>

    <Divider></Divider>

    <!-- Member view and adding -->
    <h3>Členové</h3>

    <div
      v-for="member in members"
      style="margin-bottom: 10px;">
      -> {{ member.name }}
    </div>

    <Button
      label="Přidat členy"
      icon="pi pi-plus"
      @click="GoToAddMembers"
      style="margin-top: 10px;">
    </Button>

  </div>

</template>
