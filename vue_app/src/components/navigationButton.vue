<template>
  <nav v-if="!showOnlyBackBtn && path">
    <button class="left" @click="router.push(path)">
      {{ text }}
    </button>
    <button class="right" @click="router.push('/somewhereUnknown')">
      go idk where
    </button>
  </nav>

  <button v-else class="center" @click="router.back">go back</button>
</template>

<script setup>
import { useRouter } from "vue-router";

defineProps({
  text: String,
  path: String,
  showOnlyBackBtn: Boolean,
});

const router = useRouter();
</script>

<style scoped>
button.center {
  display: flex;
  margin: auto; /* centers itself */
  margin-top: 20px;
}

nav {
  margin: 50px 0;
}

button.left {
  float: left;
}

button.right {
  float: right;
}

button {
  padding: 10px 20px;
  margin: 0 10px;
  border-width: 0;
  border-radius: 8px;
  font-family: inherit;
  font-weight: 600;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: background-color 0.2s;
  transition-timing-function: ease-in;
}

button:hover {
  background-color: white;
  color: #1a1a1a;
}
</style>
