<script setup>
import { ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import BasicHeader from '../components/basicPageHeader.vue';
import { readAllAlergens, readAllCategories, createFilter } from '../../utils/api';
import CheckBox from 'primevue/checkbox';
import { useUserStore } from '../stores/userStore'

const router = useRouter();
const user = useUserStore();

const alergens = await readAllAlergens();
const categories = await readAllCategories();
console.log(categories);


const filterName = ref();

/* ALERGENS */
const alergenAdded = ref(false);
const selectedAlergens = ref([]);

const selectAlergen = (id) => {
    const index = selectedAlergens.value.indexOf(id);
    if(index === -1)
        selectedAlergens.value.push(id);
    else
        selectedAlergens.value.splice(index, 1);

    const raw = toRaw(selectedAlergens.value);
    /* console.log(raw); */
}

const isAlergenSelected = (id) => {
    return selectedAlergens.value.includes(id);
}

const showAll = ref(false);

const selectedCategory = ref();


const createFilterFunc = async () => {
    createFilter(user.id, filterName.value, toRaw(selectedAlergens.value))
    .then(() => {
        router.back()
    })
}
</script>

<template>
    <BasicPageHeader text="Vytvoř filter"></BasicPageHeader> 

    <!-- TODO: create filter -->
    <!-- alergens -->
        <!-- let user add alergen to filter -->
    <!-- categories -->
        <!-- let user add category to filter -->
    <FloatLabel>
        <InputText id="filter_name" v-model="filterName"/>
        <label for="filter_name">Název</label>
    </FloatLabel>

    <h3>Alergeny</h3>
    <div style="display: flex; flex-wrap: wrap; max-width: 320px;">

        <div v-for="alergen in alergens" :key="alergen.id" style="margin: 2px;">
            <Tag 
            v-if="alergen.id < 9 || showAll"
            @click="selectAlergen(alergen.id)" 
            :class="{
                'p-tag-secondary': !isAlergenSelected(alergen.id), 
                'p-tag-danger': isAlergenSelected(alergen.id)
                }" 
            :value="alergen.name" style="padding: 20px 30px;"/>
        </div>
    
    </div>

    <div style="text-align: center; margin-top: 6px;">
        <Tag :value="showAll ? 'Skrýt' : 'Zobraz všechny'" @click="showAll = !showAll" rounded/>
    </div>

    <h3>Kategorie</h3>
    <!-- <div class="card flex justify-center">
        <ListBox v-model="selectedCategory"  :options="categories" optionLabel="name"></ListBox>
    </div> -->

        <!-- <Message  v-for="category in categories">
            {{ category.name }}
            <CheckBox binary/>
        </Message> -->

    <Button label="Uložit" @click="createFilterFunc()"/>
</template>