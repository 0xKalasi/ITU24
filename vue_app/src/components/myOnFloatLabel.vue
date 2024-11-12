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

// Define emit to allow v-model to work
const emit = defineEmits(['update:modelValue']);

// Function to handle input change for InputText
const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};

// Function to handle input change for InputNumber
const updateNumberValue = (value) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <FloatLabel variant="on">

    <InputNumber 
      v-if="number"
      class="p-inputtext-sm"
      :value="modelValue"
      @update:modelValue="updateNumberValue"
    />
    
    <InputText
      v-else
      class="p-inputtext-sm"
      :value="modelValue"
      @input="updateValue"
    />
    <label>{{ label }}</label>
  </FloatLabel>
</template>