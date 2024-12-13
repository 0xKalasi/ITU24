<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { computed } from "vue";

import { useRouter } from 'vue-router';
const router = useRouter();


const props = defineProps({
  requestCount: Number
});


const selected = defineModel(); // Two way binding with v-model

const ChangeListed = (which) => {
  selected.value = which;
}


const Options = {
  REQUESTS: "Žádosti",
  CHATS: "Chaty",
  BLOCKED: "Zablokované"
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
      :badgeSeverity="GetBadgeSeverity('Žádosti')"
      :severity="SetHighlight('Žádosti')"
      @click="ChangeListed('Žádosti')"
      raised
      style="flex: 1">
    </Button>
    <Button
      :label="Options.CHATS"
      :severity="SetHighlight('Chaty')"
      @click="ChangeListed('Chaty')"
      raised
      style="flex: 1">
    </Button>
    <Button
      :label="Options.BLOCKED"
      :severity="SetHighlight('Zablokované')"
      @click="ChangeListed('Zablokované')"
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
