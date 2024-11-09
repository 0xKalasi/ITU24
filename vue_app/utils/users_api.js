import { supabase } from "./supabase";

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

export { 
    readAllUsers
};
