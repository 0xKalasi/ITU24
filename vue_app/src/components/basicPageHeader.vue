<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  text: String
})
</script>

<template>
  <div style="display: flex; align-items: center; min-width: 320px">
    <Button 
      @click="router.back"
      icon="pi pi-chevron-left"
      style="height: 35px; width: 35px; background-color: transparent; color: white; border: 0px;">
    </Button>
    <h2 style="max-width: 240px; margin-left: 10px;">
      {{ text }}
    </h2>
  </div> 
</template>
