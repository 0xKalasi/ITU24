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

    <div v-if="filters.length" style="margin: 20px 0">
        <div v-for="filter in filters">
            <Message severity="warn">{{ filter.name }}</Message>
        </div>  
    </div>
    
    <h4 v-else>Nemáte žádne filtry</h4>
    <Button @click="router.push('/filters/create')">Vytvoř filter</Button>

</template>

