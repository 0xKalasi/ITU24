<script setup>
import { ref } from "vue";
import MyOnFloatLabel from "./myOnFloatLabel.vue";

// Ingredient data
const ingredients = defineModel();
const newIngredient = ref({ name: "", quantity: null, unit: "", notes: "" });
const editedIngredient = ref({ name: "", quantity: null, unit: "", notes: "" });
const editingIngredientIndex = ref(null);

// Dragging logic
const draggedIngredient = ref(null);
const draggingIndex = ref(null);

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

// Start dragging
function handleDragStart(event, index) {
    draggedIngredient.value = index;
    draggingIndex.value = index; // For styling during drag
    event.dataTransfer.effectAllowed = "move";
}

// Allow dropping
function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

// Handle drop
function handleDrop(event, index) {
    event.preventDefault();
    if (draggedIngredient.value !== null && draggedIngredient.value !== index) {
        const ingredient = ingredients.value.splice(draggedIngredient.value, 1)[0];
        ingredients.value.splice(index, 0, ingredient);
    }
    draggedIngredient.value = null;
    draggingIndex.value = null;
}

// Cancel dragging
function handleDragEnd() {
    draggedIngredient.value = null;
    draggingIndex.value = null;
}
</script>

<template>
    <div>
        <!-- Ingredients Display -->
        <div v-if="ingredients.length > 0" class="ingredients-list">
            <div
                v-for="(ingredient, index) in ingredients"
                :key="index"
                class="ingredient-item"
                :class="{ dragging: draggingIndex === index }"
                draggable="true"
                @dragstart="handleDragStart($event, index)"
                @dragover="handleDragOver"
                @drop="handleDrop($event, index)"
                @dragend="handleDragEnd"
            >
                <template v-if="editingIngredientIndex === index">
                  <div class="in-one-row">
                    <MyOnFloatLabel class="larger-input" label="Název Ingredence" v-model="editedIngredient.name" />
                    <MyOnFloatLabel :number="true" label="Množství" v-model="editedIngredient.quantity" />
                    <MyOnFloatLabel label="Jednotka" v-model="editedIngredient.unit" />
                    <MyOnFloatLabel label="Poznámka" v-model="editedIngredient.notes" />
                  </div>
                  <Button icon="pi pi-check" class="add-ingredient-btn p-button-outlined" @click="saveIngredient" />
                </template>
                <template v-else>
                <!-- Display Mode -->
                <div class="ingredient-display">
                    <div class="ingredient-field ingredient-name">{{ ingredient.name }}</div>
                    <div class="ingredient-field ingredient-unit">{{ ingredient.quantity }} {{ ingredient.unit }}</div>
                    <div class="ingredient-field ingredient-notes">{{ ingredient.notes }}</div>
                    <div class="ingredient-buttons">
                        <Button 
                            icon="pi pi-pencil" 
                            class="wide-button p-button-outlined" 
                            @click="editIngredient(index, ingredient)"
                        />
                        <Button 
                            icon="pi pi-trash" 
                            class="wide-button p-button-outlined" 
                            @click="deleteIngredient(index)"
                        />
                    </div>
                </div>
                </template>
            </div>
        </div>

        <!-- New Ingredient Input -->
        <div class="in-one-row">
                <MyOnFloatLabel class="larger-input" label="Název Ingredence" v-model="newIngredient.name" />
                <MyOnFloatLabel :number="true" label="Množství" v-model="newIngredient.quantity" />
                <MyOnFloatLabel label="Jednotka" v-model="newIngredient.unit" />
                <MyOnFloatLabel label="Poznámka" v-model="newIngredient.notes" />
              </div>
              <Button icon="pi pi-plus" class="wide-button p-button-outlined" @click="PushIngredient" />
    </div>
</template>


<style scoped>
.ingredients-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Adds space between ingredient items */
}

.ingredient-item {
    display: flex;
    flex-direction: column; /* Allow wrapping for mobile or narrow screens */
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 8px;
    transition: background-color 0.3s ease;
    width: 100%;
}

.ingredient-item.dragging {
    background-color: rgb(42, 42, 42);
}

.ingredient-display {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap; /* Allows fields to wrap if content exceeds available space */
    width: 100%;
}

.ingredient-field {
    flex: 1; /* Equal space for each field */
    word-wrap: break-word; /* Ensure long text wraps */
    white-space: normal; /* Allow natural wrapping */
    min-width: 80px; /* Ensures readability on smaller screens */
}

.ingredient-buttons {
    display: flex;
    gap: 0.5rem; /* Adds spacing between buttons */
    margin-left: auto; /* Push buttons to the utmost right */
}

.in-one-row {
    display: flex;
    align-items: center; /* Vertically align all items */
    gap: 0.5rem; /* Adjust space between elements */
    width: 100%; /* Occupy full available width */
}

.larger-input {
    flex: 4; /* Allow this input to take more space */
}
    
.in-one-row > *:not(.larger-input) {
    flex: 2; /* Keep other inputs equally sized */
}

.wide-button {
    min-width: 100px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}
</style>

