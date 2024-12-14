<script setup>
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';

const props = defineProps({
  modelValue: [String, Number], // Allow both String and Number types
  label: String,
  number: Boolean,
});

const value = defineModel();
</script>

<template>
  <FloatLabel variant="on">
    <InputNumber 
      v-if="number"
      class="custom-input"
      v-model="value"
      style="width: auto;"
    />
    
    <InputText
      v-else
      class="p-inputtext-sm custom-input"
      v-model="value"
    />
    <label class="truncate-label">{{ label }}</label>
  </FloatLabel>
</template>

<style scoped>
/* General input customization */
.custom-input {
    width: 100%;
    flex-grow: 0; 
    height: 4rem;
}

:deep(.p-inputnumber.p-component.custom-input) {
    width: 100% !important; 
}

:deep(.p-inputnumber-input) {
    width: 100% !important;
    padding: 0.25rem;
    font-size: 1.3rem;
}

.p-inputtext {
  width: 100% !important; 
  padding: 0.25rem; 
  font-size: 1.3rem;
}

/* Optional: Adjust buttons if the InputNumber has increment/decrement buttons */
.p-inputnumber-button {
  height: 24px;
  width: 24px; 
  font-size: 1.3rem;
}

/* Apply text truncation to the label */
.truncate-label {
  display: inline-block;
  max-width: calc(100% - 10px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>