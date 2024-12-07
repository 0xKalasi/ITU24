import { supabase } from "./supabase";
import { useUserStore } from '../src/stores/userStore';

const readGroupchat = async (id) => {
  let { data: groupchat, error } = await supabase
  .from('Groupchat')
  .select('*')
  .eq('id', id)

  if (error) {
    console.log(error);
    return null;
  }

  return groupchat[0];
}

const readUsersGroupchats = async (userId) => {
  // First retrieve the group ids
  const { data: memberIn, error } = await supabase
  .from('GroupchatMembers')
  .select('*')
  .eq('user', userId)

  if (error) {
    console.log(error);
    return null;
  }

  // Afterwards get information about the groups
  let groups = [];
  for (const membership of memberIn) {
    let group = await readGroupchat(membership.groupchat);
    groups.push(group);
  }

  return groups;
};

export {
  readUsersGroupchats,
  
};
