<script setup>
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { defineProps, defineEmits } from 'vue';

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
    <label>{{ label }}</label>
  </FloatLabel>
</template>

<style scoped>
/* General input customization */
.custom-input {
    width: 100%;
    flex-grow: 0; /* Prevent stretching */
    height: 3rem;
}

:deep(.p-inputnumber.p-component.custom-input) {
    width: 100% !important; /* Force desired width */
}

:deep(.p-inputnumber-input) {
    width: 100% !important; /* Inner input width */
    padding: 0.25rem;
    font-size: 0.9rem; /* Adjust font size to match smaller text inputs */
}

.p-inputtext {
  width: 100% !important; /* Ensures the inner input adapts to the wrapper width */
  padding: 0.25rem; /* Adjusts inner input padding */
  font-size: 0.9rem; /* Adjust font size to match smaller text inputs */
}

/* Optional: Adjust buttons if the InputNumber has increment/decrement buttons */
.p-inputnumber-button {
  height: 24px; /* Make buttons smaller */
  width: 24px; /* Adjust button width */
  font-size: 0.8rem; /* Adjust button icon size */
}
</style>