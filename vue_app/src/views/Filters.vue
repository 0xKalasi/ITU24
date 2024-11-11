<script setup>
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import navigationButton from '../components/navigationButton.vue';
import { readFilters } from '../../utils/api';

const router = useRouter();
const user = useUserStore();
const filters = await readFilters(user.id);
console.log(filters);
</script>

<template>
    <BasicPageHeader text="Uložené filtry"></BasicPageHeader> 

    <h2>{{ user.name }}</h2>
    <h3>Filters</h3>
    <div v-if="filters.length" v-for="filter in filters">
        {{ filter.name }}
    </div>
    <h4 v-else>Nemáte žádne filtry</h4>
    <Button @click="router.push('/filters/create')">Vytvoř filter</Button>

</template>

