/* Tomáš Bordák, xborda01 */

import { defineStore } from "pinia"
import { supabase } from "../../utils/supabase";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const id = ref();
  const name = ref("");
  const bio = ref("");

  // log in as user
  const login = async (userId) => {
    if(userId != 0){
      const user = await getUserFromDatabase(userId);
    
      if(user){
        id.value = user.id;
        name.value = user.name;
        bio.value = user.bio;
    
        localStorage.setItem("resipi_app_user", id.value);
      }
    }
  }
   
  // log out
  const logout = () => {
    id.value = 0;
    localStorage.removeItem("resipi_app_user");
  }
    
  const getUserFromDatabase = async (id) => {
    const { data: user, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', id)
    .single()
    
    if (error) {
      console.log(error);
      return null;
    }
    
    return user;
  }
    
  // at app start or refresh 
  const tryLoginFromLocSt = async () => {
    const userFromLocSt = localStorage.getItem("resipi_app_user");
    if(userFromLocSt){
      await login(userFromLocSt);
    }
  }

  return { id, name, bio, login, logout, tryLoginFromLocSt };
});

// name and bio might have been edited and aren't store elsewhere
// editMode is needed to set the mode correctly when returning from preview page
export const profilePreviewStore = defineStore("preview", () => {
  const name = ref("");
  const bio = ref("");

  const editMode = ref(false);

  return { name, bio, editMode };
});

// Enumeration of selectable options for Friends page
export const Options = {
  REQUESTS: "Žádosti",
  CHATS: "Chaty",
  BLOCKED: "Zablokované"
}

// we need ot remeber where we were last time we accessed chats
export const chatsSelectedStore = defineStore("selected", () => {
  const option = ref("Chaty");

  return { option };
});
