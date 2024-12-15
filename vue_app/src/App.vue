<!-- 
    FILE:       App.vue
    AUTHOR:     Tomáš Bordák, xborda01 
    DATE:       15.12.2024
    INFO:       Main view of app that uses router (routerView) to change view of app. Always shows navigation on top of each view.
-->

<script setup>
import { computed } from 'vue';
import navigation from '@/components/navigation/navigation.vue';
</script>

<template>
    <Suspense>
        <routerView></routerView>
    </Suspense>
    <navigation></navigation>
    <div style="height: 100px;"></div> <!-- so navigation isnt blocking text -->
</template>