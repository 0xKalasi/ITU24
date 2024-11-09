<script setup>
    import { readAllUsers, switchUser } from "../../utils/users_api.js";
    import { useRouter } from "vue-router";
    import { useUserStore } from '../stores/userStore';
    const currentUser = useUserStore();

    const router = useRouter();

    const users = await readAllUsers();

</script>

<template>
    <Button label="Zpět" @click="router.back()"></Button>
    <h2>Uživatelé</h2>

    <table>
        <tr v-for="user in users">
            <th>{{ user.name }}</th>
            <Button @click="switchUser(user.id); router.push('/')">Přihlásit</Button>
        </tr>
    </table>

</template>
