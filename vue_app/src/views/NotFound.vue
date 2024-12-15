<!-- 
    FILE:       NotFound.vue
    AUTHOR:     Tomáš Bordák, xborda01 
    DATE:       15.12.2024
    INFO:       Page not found scenario, router redirects user to this page, when none of the routes match.
-->

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <h2>404 - NotFound</h2>
  <Button @click="router.back" label="Zpět"/>
</template>
