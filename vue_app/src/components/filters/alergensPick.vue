<!-- 
    FILE:       alergensPick.vue
    AUTHOR:     Tomáš Bordák, xborda01 
    DATE:       15.12.2024
    INFO:       Component for picking alergens, works based on v-model (defineModel) value,
                because data can come to and also go out of component (array of selected alergens)
-->

<script setup>
import { ref } from 'vue';
import { readAllAlergens } from '@utils/api';

const alergens = await readAllAlergens();
const restAlergens = alergens.splice(6); // leaving first 6 in alergens, rest to restAlergens

const alergenAdded = ref(false);

const selectedAlergens = defineModel({
  type: Array,
  default: () => [],
});

// function for toggling if alergen is selected or not
const select = (id) => {
    const index = selectedAlergens.value.indexOf(id);

    if(index == -1){
        // alergen (id) is not selected yet -> select it
        selectedAlergens.value.push(id);
    }
    else{
        // alergen (id) IS already selected -> unselect it
        selectedAlergens.value.splice(index, 1);
    }
}

const isSelected = (id) => {
    return selectedAlergens.value.includes(id);
}

const showAll = ref(false);
</script>

<template>
    <div style="display: flex; flex-wrap: wrap; gap: 4px; justify-content: center;">
        <div v-for="alergen in alergens" :key="alergen.id">
            <Tag 
            @click="select(alergen.id)" 
            :class="{
                'p-tag-secondary': !isSelected(alergen.id), 
                'p-tag-danger': isSelected(alergen.id)
                }" 
            :value="alergen.name" style="padding: 16px 16px ; width: 96px; height: 66px; text-align: center; cursor: pointer; font-size: 16px;"/>
        </div>

        <div v-for="alergen in restAlergens" :key="alergen.id" v-if="showAll">
            <Tag 
            @click="select(alergen.id)" 
            :class="{
                'p-tag-secondary': !isSelected(alergen.id), 
                'p-tag-danger': isSelected(alergen.id)
                }" 
            :value="alergen.name" style="padding: 16px 16px ; width: 96px; height: 66px; text-align: center; cursor: pointer; font-size: 16px;">
            </Tag>
        </div>
    </div>

    <div style="text-align: center; margin-top: 6px; cursor: pointer;">
        <Tag :value="showAll ? 'Skrýt' : 'Zobrazit všechny'" @click="showAll = !showAll" rounded severity="info"/>
    </div>
</template>