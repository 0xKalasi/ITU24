<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { computed } from "vue";

import { useRouter } from 'vue-router';
const router = useRouter();

import { Options } from "../stores/userStore";

const props = defineProps({
  requestCount: Number
});


const selected = defineModel(); // Two way binding with v-model

const ChangeListed = (which) => {
  selected.value = which;
}


const SetHighlight = computed(() => (which) => {
  return (selected.value == which) ? "primary" : "secondary";
});

const PendingCount = computed(() => {
  return (props.requestCount == 0) ? "" : String(props.requestCount);
});

const GetBadgeSeverity = computed(() => (which) => {
  return (selected.value == which) ? "secondary" : "contrast";
});

</script>

<template>
  <ButtonGroup class="group">
    <Button
      :label="Options.REQUESTS"
      :badge="PendingCount"
      :badgeSeverity="GetBadgeSeverity(Options.REQUESTS)"
      :severity="SetHighlight(Options.REQUESTS)"
      @click="ChangeListed(Options.REQUESTS)"
      raised
      style="flex: 1">
    </Button>

    <Button
      :label="Options.CHATS"
      :severity="SetHighlight(Options.CHATS)"
      @click="ChangeListed(Options.CHATS)"
      raised
      style="flex: 1">
    </Button>

    <Button
      :label="Options.BLOCKED"
      :severity="SetHighlight(Options.BLOCKED)"
      @click="ChangeListed(Options.BLOCKED)"
      raised
      style="flex: 1">
    </Button>

  </ButtonGroup>

</template>

<style scoped>
.group {
  display: flex;
  justify-content: center;
  border: 1px solid aquamarine;
  border-radius: 7px;
}

</style>
