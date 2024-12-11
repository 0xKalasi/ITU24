
<script setup>
import { ref, defineModel} from "vue"
import MyOnFloatLabel from "./myOnFloatLabel.vue"
  // Ingredient data
    const ingredients = defineModel();

  const newIngredient = ref({ name: "", quantity: null, unit: "" });
  const editedIngredient = ref({ name: "", quantity: null, unit: "" });
  const editingIngredientIndex = ref(null);

   // Add new ingredient
   function PushIngredient() {
      if (newIngredient.value.name) {
        ingredients.value.push({ ...newIngredient.value });
        newIngredient.value = { name: "", quantity: null, unit: "" };
      }
    }

    // Edit ingredient
    function editIngredient(index, ingredient) {
      editingIngredientIndex.value = index;
      editedIngredient.value = { ...ingredient };
    }
    // Delete ingredient
    function deleteIngredient(index) {
      ingredients.value.splice(index, 1);
    }

    // Save edited ingredient
    function saveIngredient(index) {
      ingredients.value[index] = { ...editedIngredient.value };
      editingIngredientIndex.value = null;
      editedIngredient.value = { name: "", quantity: null, unit: "" };
    }

    // Cancel ingredient edit
    function cancelIngredientEdit() {
      editingIngredientIndex.value = null;
      editedIngredient.value = { name: "", quantity: null, unit: "" };
    }
</script>

<template>
    <!-- Display each ingredient with edit options -->
    <div v-if="ingredients.length > 0" class="p-d-flex p-ai-center p-mb-10">
          <div v-for="(ingredient, index) in ingredients" :key="index" class="p-d-flex p-ai-center p-mb-2">
            <template v-if="editingIngredientIndex === index">
              <!-- Editing Mode -->
              <MyOnFloatLabel label="Název Ingredence" v-model="editedIngredient.name" />
              <MyOnFloatLabel :number="true" label="Množství" v-model="editedIngredient.quantity" />
              <MyOnFloatLabel label="Jednotka" v-model="editedIngredient.unit" />
              <Button icon="pi pi-check" class="p-button-text p-button-rounded" @click="saveIngredient(index)" />
              <!-- <Button icon="pi pi-times" class="p-button-text p-button-rounded" @click="cancelIngredientEdit" /> -->
            </template> 
            <template v-else>
              <!-- Display Mode -->
              <li>{{ ingredient.name }}, {{ ingredient.quantity }} {{ ingredient.unit }}
                <Button icon="pi pi-pencil" class="p-button-text p-button-rounded" @click="editIngredient(index, ingredient)" />
                <Button icon="pi pi-trash" class="p-button-text p-button-rounded" @click="deleteIngredient(index)" />
              </li>
            </template>
          </div>
        </div>
  
        <!-- New ingredient input -->
        <div class="in-one-row">
          <MyOnFloatLabel label="Název Ingredence" v-model="newIngredient.name" />
          <MyOnFloatLabel :number="true" label="Množství" v-model="newIngredient.quantity" />
          <MyOnFloatLabel label="Jednotka" v-model="newIngredient.unit" />
        </div>
        <Button icon="pi pi-plus" class="p-button-text p-button-rounded" @click="PushIngredient" />
</template>