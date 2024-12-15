<script setup>
    import { useRoute } from 'vue-router';
    const route = useRoute();

    import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from '../../stores/userStore';
const user = useUserStore();


const isSelected = (pth) => {
    return route.path == pth;
}

const props = defineProps({
    path: String,
    label: String,
    hasLabel: Boolean,
    icon: String,
})
</script>

<template>
    <Button v-if="props.hasLabel" class="with-label" :icon="props.icon" :label="props.label" @click="router.push(props.path)" :class="{ selected : isSelected(props.path) }"/>
    <Button v-else :icon="props.icon" @click="router.push(props.path)" :class="{ selected : isSelected(props.path) }"/>
</template>

<style scoped>
.selected{
    background-color: var(--p-primary-300);
}

.with-label {
    min-width: 132px;
    border-right: 0.5px solid black;
}
</style>