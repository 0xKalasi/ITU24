<script setup>
import Button from 'primevue/button';
import { useUserStore } from './stores/userStore';
import { computed } from 'vue';
import navigation from './components/navigation.vue';

const user = useUserStore();

</script>

<template>
    <Suspense>
        <routerView></routerView>
    </Suspense>
    <navigation></navigation>
    <div style="height: 100px;"></div> <!-- so navigation isnt blocking text -->
</template>

<style scoped>
</style>

