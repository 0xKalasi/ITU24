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
    <h3>{{ user.id }}</h3>
    <h1>/ vue app /</h1>
    <Button icon-pos="right">dasdas</Button>
    <routerView></routerView>
</template>
