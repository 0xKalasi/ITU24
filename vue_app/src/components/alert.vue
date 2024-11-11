<script setup>
defineProps({
  text: String,
  type: String,
});
</script>

<template>
    <Message :life="3000" :severity="type" style="position: absolute; right: 20px;" closable>{{ text }}</Message>
</template>