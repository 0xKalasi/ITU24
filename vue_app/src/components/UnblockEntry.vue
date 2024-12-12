<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from "../stores/userStore";
const currentUser = useUserStore();

import { unblockUser } from '../../utils/users_api';

const props = defineProps({
  blocked: Object
});


const GoToProfile = async (id) => {
  router.push(`/profile/${id}`);
}

const UnBlock = async (id) => {
  await unblockUser(currentUser.id, id);
}

</script>

<template>
<ButtonGroup class="blocked">
  <Button
    severity="secondary"
    @click="GoToProfile(blocked.id)"
    raised
    class="name-button">
    {{ blocked.name }}
  </Button>

  <Button
    icon="pi pi-lock-open"
    @click="UnBlock(blocked.id)"
    raised
    size="large"
    style="width: 100px">
  </Button>

</ButtonGroup>
</template>

<style scoped>
.blocked {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
}

.name-button {
  flex-grow: 1;
}

</style>
