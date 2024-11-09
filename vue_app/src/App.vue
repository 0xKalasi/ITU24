<script setup>
import Button from 'primevue/button';
import { useUserStore } from './stores/userStore';
import { computed } from 'vue';

const user = useUserStore();
const userId = computed(() => user.id)

console.log('userId is: ', userId.value);

user.id = 3;

console.log('userId is: ', userId.value);
</script>

<template>
    <h1><i>resipe.</i></h1>
    <Suspense>
        <routerView></routerView>
    </Suspense>
</template>
