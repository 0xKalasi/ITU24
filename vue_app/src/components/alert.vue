<script setup>
defineProps({
  text: String,
  type: String,
});
</script>

<template>
    <Message :life="3000" :severity="type" 
    style="position: absolute; top: 10px; left: 50%; transform: translate(-50%, 0); z-index: 10" closable>
    {{ text }}
    </Message>
</template>