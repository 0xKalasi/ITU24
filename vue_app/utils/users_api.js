import { supabase } from "./supabase";
import { useUserStore } from '../src/stores/userStore';

const readAllUsers = async () => {
    const { data: users, error } = await supabase
        .from('User')
        .select('*')

    if (error) {
        console.log(error);
        return null;
    }

    return users;
}

const readUser = async (id) => {
    const { data: user, error } = await supabase
        .from('User')
        .select('*')
        .eq('id', id)

    if (error) {
        console.log(error);
        return null;
    }

    if (user.length == 0) {
        return null;
    }

    return user[0];
}

// switch to user with given id or logout when id is invalid
const switchUser = async (id) => {
    const userStore = useUserStore();
    const u = await readUser(id);

    if (u != null) {
        userStore.id = u.id;
        userStore.name = u.name;
        userStore.bio = u.bio;
    } else {
        userStore.id = 0;
        userStore.name = "";
        userStore.bio = "";
    }
}

export {
    readAllUsers,
    switchUser
};
