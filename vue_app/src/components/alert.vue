<!-- 
    FILE:       alert.vue
    AUTHOR:     Tomáš Bordák, xborda01 
    DATE:       15.12.2024
    INFO:       Alert that will show for 3 seconds. Is fixed to top of page and has green color for success, red color for error and orange for warning alert.
-->

<script setup>
defineProps({
  text: String,
  type: String,
});
</script>

<template>
    <Message :life="3000" :severity="type" 
    style="position: fixed; top: 10px; left: 50%; transform: translate(-50%, 0); z-index: 10" closable>
    {{ text }}
    </Message>
</template>

<style scoped>
.p-message-success {
  background: var(--p-emerald-400);
  outline-color: transparent;
  color: black;
}

.p-message-error {
  background: var(--p-red-400);
  outline-color: transparent;
  color: black;
}

.p-message-warn {
  background: var(--p-amber-400);
  outline-color: transparent;
  color: black;
}
</style>