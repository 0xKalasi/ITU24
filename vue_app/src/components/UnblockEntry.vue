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


const GoToProfile = async () => {
  router.push(`/profile/${props.blocked.id}`);
}

const UnBlock = async () => {
  await unblockUser(currentUser.id, props.blocked.id);
}

</script>

<template>
<ButtonGroup class="blocked">
  <Button
    severity="secondary"
    @click="GoToProfile"
    raised
    class="name-button">
    {{ blocked.name }}
  </Button>

  <Button
    icon="pi pi-lock-open"
    @click="UnBlock"
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
  margin: 20px 0 20px 0;
}

.name-button {
  flex-grow: 1;
}

</style>
