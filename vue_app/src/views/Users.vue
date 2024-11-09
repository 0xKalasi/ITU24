<script setup>
    import { readAllUsers } from "../../utils/users_api.js";
    import { useRouter } from "vue-router";

    const users = await readAllUsers();
    const router = useRouter();
</script>

<template>
    <Button label="Zpět" @click="router.back()"></Button>
    <h2>Uživatelé</h2>

    <div>
        <ul>
            <li v-for="user in users">
                {{ user.name }}
            </li>
        </ul>
    </div>

</template>
