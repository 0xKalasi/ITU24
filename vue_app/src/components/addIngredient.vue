
<script setup>
import { ref, defineModel} from "vue"
import MyOnFloatLabel from "./myOnFloatLabel.vue"
  // Ingredient data
  const ingredients = defineModel();

  const newIngredient = ref({ name: "", quantity: null, unit: "", notes: "" });
  const editedIngredient = ref({ name: "", quantity: null, unit: "", notes: "" });
  const editingIngredientIndex = ref(null);

   // Add new ingredient
   function PushIngredient() {
    if (newIngredient.value.name) {
        ingredients.value.push({ ...newIngredient.value });
        newIngredient.value = { name: "", quantity: null, unit: "", notes: "" };
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
      editedIngredient.value = { name: "", quantity: null, unit: "", notes: "" };
    }

    // Cancel ingredient edit
    function cancelIngredientEdit() {
      editingIngredientIndex.value = null;
      editedIngredient.value = { name: "", quantity: null, unit: "", notes: "" };
    }
</script>

<template>
    <!-- Display each ingredient with edit options -->
    <div v-if="ingredients.length > 0" class="p-d-flex p-ai-center p-mb-10">
          <div v-for="(ingredient, index) in ingredients" :key="index" class="in-one-row">
            <template v-if="editingIngredientIndex === index">
              <!-- Editing Mode -->
              <MyOnFloatLabel class="larger-input" label="Název Ingredence" v-model="editedIngredient.name" />
              <MyOnFloatLabel :number="true" label="Množství" v-model="editedIngredient.quantity" />
              <MyOnFloatLabel label="Jednotka" v-model="editedIngredient.unit" />
              <MyOnFloatLabel label="Poznámka" v-model="editedIngredient.notes" />
              <Button icon="pi pi-check" class="p-button-text p-button-rounded" @click="saveIngredient(index)" />
              <!-- <Button icon="pi pi-times" class="p-button-text p-button-rounded" @click="cancelIngredientEdit" /> -->
            </template> 
            <template v-else>
              <!-- Display Mode -->
              <li>{{ ingredient.name }}, {{ ingredient.quantity }} {{ ingredient.unit }} - {{ ingredient.notes }}
                <Button icon="pi pi-pencil" class="p-button-text p-button-rounded" @click="editIngredient(index, ingredient)" />
                <Button icon="pi pi-trash" class="p-button-text p-button-rounded" @click="deleteIngredient(index)" />
              </li>
            </template>
          </div>
        </div>
  
        <!-- New ingredient input -->
        <div>
          <div class="in-one-row">
            <MyOnFloatLabel class="larger-input" label="Název Ingredence" v-model="newIngredient.name" />
            <MyOnFloatLabel :number="true" label="Množství" v-model="newIngredient.quantity" />
            <MyOnFloatLabel label="Jednotka" v-model="newIngredient.unit" />
            <MyOnFloatLabel label="Poznámka" v-model="newIngredient.notes" />
            <Button icon="pi pi-plus" class="add-button" @click="PushIngredient" />
          </div>
        </div>
</template>

<style scoped>
.in-one-row {
  display: flex; /* Arrange elements in a row */
  align-items: center; /* Vertically align all items */
  gap: 1px; /* Adjust space between elements */
  width: 100%; /* Occupy full available width */
}

.add-button {
  width: 10px; /* Square width */
  height: 30px; /* Square height */
  padding: 0; /* Remove unnecessary padding */
  flex: 1;
  /*margin-left: 8px; /* Add some spacing to the last input */
}

.larger-input {
  flex: 4; /* Allow this input to take more space */
}

.in-one-row > *:not(.larger-input, .add-button) {
  flex: 2; /* Keep other inputs equally sized */
}
</style>