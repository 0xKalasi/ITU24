<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';


const currentUser = useUserStore();

const router = useRouter();

</script>

<template>
  groupchat

</template>

<style scoped>
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>

