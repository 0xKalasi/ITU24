<script setup>
import { useRouter } from "vue-router";

import { readGroupchat, updateGroupName } from "../../utils/groupchat_api";
import { ref } from "vue";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);

const isCreator = (currentUser.id == currentGroup.creator) ? true : false;

const groupName = ref(currentGroup.name);

const nameChanged = ref(false);
const nameChangedKey = ref(0);

</script>

<template>
  <Alert v-if="nameChanged" severity="success" 
    text="Jméno skupiny změněno."
    :key="nameChangedKey"/>

  <BasicPageHeader text="Spravovat skupinu"></BasicPageHeader>
  <div class="devider"></div>

  <div v-if="currentUser.id == 0" style="margin-top: 20px">
    Pro zobrazení správy skupin musíte být přihlášeni.
  </div>

  <!-- CREATOR VIEW -->
  <div v-else-if="isCreator">
    <!-- Rename -->
    <div style="display: flex; align-items: center; margin-top: 20px; margin-bottom: 20px;">
      <input v-model="groupName"/>
      <Button
        label="Přejmenovat"
        icon="pi pi-pencil"
        @click="nameChanged = true; nameChangedKey++; updateGroupName(currentGroup.id, groupName)">
      </Button>
    </div>

    <div class="devider"></div>
  </div>

  <!-- MEMBER VIEW -->
  <div v-else>

    Jste člen skupiny

  </div>

  <!-- TODO MEMBERS -->
  <!-- TODO DELETE HISTORY -->

</template>

<style scoped>
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>
