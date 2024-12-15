<!-- 
    FILE:       addUtencils.vue
    AUTHOR:     Tomáš Tomcsányi, xtomcs00 
    DATE:       15.12.2024
-->
<script setup>
  import { ref } from "vue";
  import MyOnFloatLabel from "./myOnFloatLabel.vue";

  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => [],
    },
  });

  // Aray which is propagated out of the component
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

</script>

<template>
  <div>
    <!-- Displaying of utencils -->
    <div v-for="(utencil, index) in utencils" :key="index" class="utencil-row">
      <div class="utencil-name">
        <template v-if="editingIndex === index">
          <MyOnFloatLabel v-model="editedUtencil" @keyup.enter="saveUtencil(index)" label="Název náčiní" />
        </template>
        <template v-else>
          <div>
            {{ utencil.name }}
          </div>
        </template>
      </div>
      <div class="utencil-buttons">
        <!-- Editing of utencils -->
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
            class="wide-button p-button-outlined p-button-danger" 
            @click="deleteUtencil(index)" 
          />
        </template>
      </div>
    </div>

    <!-- Input for utencils -->
    <div>
      <MyOnFloatLabel v-model="newUtencil" @keyup.enter="PushUtencil" label="Název náčiní" />
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
    justify-content: space-between; 
    align-items: center;
    margin-bottom: 1rem;
  }
  .utencil-row:hover {
    background-color: rgb(42, 42, 42);
  }

  .utencil-name {
    flex: 1; 
    font-size: 1rem;
    text-align: left;
    word-wrap: break-word;
    white-space: normal; 
    max-width: 8rem;
  }

  .utencil-buttons {
    display: flex;
    gap: 0.5rem; 
  }


  .wide-button {
    margin-top: 0.5rem;  
    min-width: 100px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
</style>
