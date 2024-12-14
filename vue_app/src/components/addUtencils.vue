<script setup>
import { ref } from "vue";
import MyOnFloatLabel from "./myOnFloatLabel.vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const utencils = defineModel();

const newUtencil = ref("");
const editedUtencil = ref("");
const editingIndex = ref(null);

// Add a new utensil
function PushUtencil() {
  if (newUtencil.value.trim() !== "") {
    utencils.value.push({ name: newUtencil.value });
    newUtencil.value = "";
  }
}

// Enable editing mode for a utensil
function editUtencil(index, name) {
  editingIndex.value = index;
  editedUtencil.value = name;
}

// Save the edited utensil
function saveUtencil(index) {
  if (editedUtencil.value.trim() !== "") {
    utencils.value[index].name = editedUtencil.value;
    editingIndex.value = null;
    editedUtencil.value = "";
  }
}

// Delete a utensil
function deleteUtencil(index) {
  utencils.value.splice(index, 1);
  if (editingIndex.value === index) {
    editingIndex.value = null;
    editedUtencil.value = "";
  }
}

// Cancel the edit
function cancelEdit() {
  editingIndex.value = null;
  editedUtencil.value = ""; // Clear the edited utensil input
}
</script>

<template>
  <div>
    <div v-for="(utencil, index) in utencils" :key="index" class="utencil-row">
      <div class="utencil-name">
        <template v-if="editingIndex === index">
          <MyOnFloatLabel v-model="editedUtencil" @keyup.enter="saveUtencil(index)" label="Název pomúcky" />
        </template>
        <template v-else>
          <div >
            {{ utencil.name }}
          </div>
        </template>
      </div>
      <div class="utencil-buttons">
        <template v-if="editingIndex === index">
          <Button icon="pi pi-check" class="wide-button p-button-outlined" @click="saveUtencil(index)" />
        </template>
        <template v-else>
          <Button 
            icon="pi pi-pencil" 
            class="wide-button p-button-outlined" 
            @click="editUtencil(index, utencil.name)" 
          />
          <Button 
            icon="pi pi-trash" 
            class="wide-button p-button-outlined" 
            @click="deleteUtencil(index)" 
          />
        </template>
      </div>
    </div>

    <div>
      <MyOnFloatLabel v-model="newUtencil" @keyup.enter="PushUtencil" label="Název pomúcky" />
      <Button 
        icon="pi pi-plus" 
        class="wide-button p-button-outlined" 
        @click="PushUtencil" 
      />
    </div>
  </div>
</template>

<style scoped>
.utencil-row {
  display: flex;
  justify-content: space-between; /* Ensures buttons are on the far right */
  align-items: center;
  margin-bottom: 1rem;
}

.utencil-name {
  flex: 1; /* Takes up all available space */
  font-size: 1rem;
  text-align: left;
  word-wrap: break-word; /* Allows long words to break and wrap to the next line */
  white-space: normal; /* Ensures that text wraps naturally */
  max-width: 8rem;
}

.utencil-buttons {
  display: flex;
  gap: 0.5rem; /* Adds spacing between buttons */
}


.wide-button {
  min-width: 100px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}
</style>
