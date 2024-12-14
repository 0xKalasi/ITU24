<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { computed } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from "../stores/userStore";
const currentUser = useUserStore();

import { unblockUser } from '../../utils/users_api';


const props = defineProps({
  blocked: Object
});


const truncateStr = computed(() => (str, max) => {
  if (str.length > max) {
    return str.substring(0, max - 3) + "...";
  } else {
    return str;
  }
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
    :label="truncateStr(blocked.name, 23)"
    severity="secondary"
    @click="GoToProfile"
    raised
    class="name-button">
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
