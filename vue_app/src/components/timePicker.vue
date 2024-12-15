<script setup>
  import { ref, watch, computed } from "vue";
  import InputNumber from "primevue/inputnumber";

  const props = defineProps({
    modelValue: {
      type: Number,
      default: 0, // Total time in seconds
    },
  });

  const emit = defineEmits(["update:modelValue"]);

  // Reactive variables, initializing from props.modelValue (seconds)
  const hours = ref(Math.floor(props.modelValue / 3600));
  const minutes = ref(Math.floor((props.modelValue % 3600) / 60));

  // Compute total time in seconds
  const tot_time = computed(() => hours.value * 3600 + minutes.value * 60);

  // Watch computed total time and emit changes
  watch(tot_time, (newTime) => {
    emit("update:modelValue", newTime);
  });

  // Watch prop value and update hours and minutes accordingly
  watch(
    () => props.modelValue,
    (newValue) => {
      hours.value = Math.floor(newValue / 3600);
      minutes.value = Math.floor((newValue % 3600) / 60);
    },
    { immediate: true } 
  );

</script>

<template>
  <div >
    <InputNumber
      id="hours"
      v-model="hours"
      :min="0"
      :max="100"
      placeholder="Hours"
      :showButtons="true"
      buttonLayout="horizontal"
      decrementButtonClass="p-button-sm p-button-secondary"
      incrementButtonClass="p-button-sm p-button-secondary"
      decrementButtonIcon="pi pi-minus"
      incrementButtonIcon="pi pi-plus"
      class="p-inputnumber-sm time-input"
    />
    <span> Hodin</span>
    <InputNumber
      id="minutes"
      v-model="minutes"
      :min="0"
      :max="59"
      placeholder="Minutes"
      :showButtons="true"
      buttonLayout="horizontal"
      decrementButtonClass="p-button-sm p-button-secondary"
      incrementButtonClass="p-button-sm p-button-secondary"
      decrementButtonIcon="pi pi-minus"
      incrementButtonIcon="pi pi-plus"
      class="p-inputnumber-sm time-input"
    />
    <span> Minut</span>
  </div>
</template>

<style scoped>
  :deep(.p-inputnumber-input) {
      width: 100% !important;
      padding: 0.25rem;
      font-size: 1.3rem;
  }

  .time-input {
    max-width: 50%;
  }
</style>
