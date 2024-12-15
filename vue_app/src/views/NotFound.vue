<!-- Tomáš Bordák, xborda01 -->

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <h2>404 - NotFound</h2>
  <Button @click="router.back" label="Zpět"/>
</template>
