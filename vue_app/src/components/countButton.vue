<template>
  <button type="button" @click="count++">count is {{ count }}</button>
</template>

<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<style scoped>
button {
  border-radius: 8px;
  border: 2px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: aquamarine;
}
</style>
