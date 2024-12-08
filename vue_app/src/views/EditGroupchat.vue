<script setup>
import { useRouter } from "vue-router";

import { readGroupchat } from "../../utils/groupchat_api";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);

const isCreator = (currentUser.id == currentGroup.creator) ? true : false;

</script>

<template>  
  <BasicPageHeader text="Spravovat skupinu"></BasicPageHeader>
  <div class="devider"></div>

  <div v-if="isCreator">
    Jste tvůrce skupiny
  </div>
  <div v-else>
    Jste člen skupiny
  </div>

  <!-- CHANGE NAME -->
  <!-- MEMBERS -->
  <!-- DELETE HISTORY -->

</template>

<style scoped>
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>
