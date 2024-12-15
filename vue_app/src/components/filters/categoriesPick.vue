<!-- Tomáš Bordák, xborda01 -->

<script setup>
import { ref, watch } from 'vue';
import { readAllCategories } from '@utils/api';

const categories = await readAllCategories();

const selectedCategories = defineModel({
  type: Array,
  default: () => [], 
});

const showWarnMsg = ref(false);

// function for toggling if category is selected or not
const select = (id) => {

    // returns -1 when index was not found
    const index = selectedCategories.value.indexOf(id);

    // no more than 3 categories
    if(selectedCategories.value.length >= 3){
        showWarnMsg.value = true;

        // let user to unselect selected 
        if(index != -1){
            selectedCategories.value.splice(index, 1);

            if(selectedCategories.value.length <= 3 ){
                showWarnMsg.value = false;
            }
        }

        return;
    }
    
    if(showWarnMsg.value === true){
        showWarnMsg.value = false;
    }

    if(index == -1){
        // category(id) is not selected yet -> select it
        selectedCategories.value.push(id);
    }
    else{
        // category(id) IS already selected -> unselect it
        selectedCategories.value.splice(index, 1);
    }
}

const isSelected = (id) => {
    return selectedCategories.value.includes(id);
}

</script>

<template>
    <Message 
        v-if="showWarnMsg" 
        severity="warn" 
        icon="pi pi-exclamation-circle" 
        variant="simple" 
        size="small"
        style="margin-bottom: 8px;">Maximální počet vybraných kategorií je 3.</Message>

    <div style="text-align: center;">
        <div v-for="category in categories" :key="category.id" style="margin-bottom: 4px;">
            <Tag
                @click="select(category.id)"
                :class="{
                'p-tag-secondary': !isSelected(category.id), 
                'p-tag-primary': isSelected(category.id)
                }"
                :value="category.name" style="padding: 8px 0 ; width: 90%; text-align: center; cursor: pointer; font-size: 16px;">
            </Tag>
        </div>
    </div>
</template>