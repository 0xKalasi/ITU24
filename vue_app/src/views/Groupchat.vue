<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readGroupchat } from "../../utils/groupchat_api";


const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);


const IsCreator = computed(() => {
  return (currentUser.id == currentGroup.creator) ? "pi pi-pencil" : "pi pi-plus";
});

const GoToEdit = async () => {
  router.push(`/groupchats/edit/${currentGroup.id}`);
}


const isLoading = ref(false);

</script>

<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>
    <div style="position: relative; display: flex; align-items: center; min-width: 320px;">
      <BasicPageHeader :text="currentGroup.name"></BasicPageHeader>

      <Button
        :icon="IsCreator"
        @click="GoToEdit"
        style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);">
      </Button>
    </div> 

    <Divider style="margin-bottom: 0px; margin-top: 10px;"></Divider>

    <GroupchatComp></GroupchatComp>

  </div>

</template>
