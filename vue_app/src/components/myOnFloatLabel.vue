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
      class="p-inputtext-sm" 
      v-model="value"
    />
    
    <InputText
      v-else
      class="p-inputtext-sm"
      v-model="value"
    />
    <label>{{ label }}</label>
  </FloatLabel>
</template>
