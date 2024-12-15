<script setup>
    import { ref, defineModel} from "vue";
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
        if(editingIngredientIndex.value === null){
            draggedIngredient.value = index;
            draggingIndex.value = index; 
            event.dataTransfer.effectAllowed = "move";
        }
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
                    <MyOnFloatLabel style="flex" label="Název Ingredence" v-model="editedIngredient.name" />
                  <div class="in-one-row">
                    <MyOnFloatLabel :number="true" label="Množství" v-model="editedIngredient.quantity" />
                    <MyOnFloatLabel label="Jednotka" v-model="editedIngredient.unit" />
                    <MyOnFloatLabel label="Poznámka" v-model="editedIngredient.notes" />
                  </div>
                  <Button icon="pi pi-check" class="add-ingredient-btn p-button-outlined" @click="saveIngredient(index)" />
                </template>
                <template v-else>
                <!-- Display Mode -->
                <div class="ingredient-display">
                    <i class="pi pi-bars draggable-icon" title="Drag to reorder"></i>
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
                            class="wide-button p-button-outlined p-button-danger" 
                            @click="deleteIngredient(index)"
                        />
                    </div>
                </div>
                </template>
            </div>
        </div>

        <!-- New Ingredient Input -->
        <MyOnFloatLabel style="flex" label="Název Ingredence" v-model="newIngredient.name" />
        <div class="in-one-row">
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
        gap: 0.5rem;
    }

    .ingredient-item {
        display: flex;
        flex-direction: column; 
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
        flex-wrap: wrap; 
        width: 100%;
    }

    .ingredient-field {
        flex: 1; 
        word-wrap: break-word;
        white-space: normal; 
        min-width: 80px; 
    }

    .ingredient-buttons {
        display: flex;
        gap: 0.5rem; 
        margin-left: auto; 
    }

    .in-one-row {
        display: flex;
        align-items: center;
        gap: 0.5rem; 
        width: 100%; 
    }

    .larger-input {
        flex: 4;
    }
        
    .in-one-row > *:not(.larger-input) {
        flex: 2; 
    }

    .wide-button {
        margin-top: 0.5rem;  
        min-width: 100px;
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
    
    .draggable-icon {
    cursor: grab;
    margin-right: 0.5rem;
    color: #888;
    font-size: 1.2rem;
    vertical-align: middle;
    }
</style>

