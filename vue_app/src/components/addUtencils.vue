<script setup>
import { ref, defineModel } from "vue";

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
  <div v-for="(utencil, index) in utencils" :key="index" class="p-d-flex p-ai-center p-mb-2">
    <template v-if="editingIndex === index">
      <InputText 
        v-model="editedUtencil" 
        class="p-inputtext-sm" 
        @keyup.enter="saveUtencil(index)" 
        placeholder="Edit utensil name" 
      />
      <Button 
        icon="pi pi-check" 
        class="p-button-text p-button-rounded p-ml-2" 
        @click="saveUtencil(index)" 
      />
    </template>
    <template v-else>
      <span>
        {{ utencil.name }}
        <Button 
          icon="pi pi-pencil" 
          class="p-button-text p-button-rounded p-ml-2" 
          @click="editUtencil(index, utencil.name)" 
        />
        <Button 
          icon="pi pi-trash" 
          class="p-button-text p-button-rounded" 
          @click="deleteUtencil(index)" 
        />
      </span>
    </template>
  </div>

  <div class="p-d-flex p-ai-center p-mt-3">
    <InputText 
      v-model="newUtencil" 
      placeholder="Type utensil name" 
      class="p-inputtext-sm p-d-block" 
      @keyup.enter="PushUtencil" 
    />
    <Button 
      icon="pi pi-plus" 
      class="p-button-text p-button-rounded p-ml-2" 
      @click="PushUtencil" 
    />
  </div>
</div>
</template>
