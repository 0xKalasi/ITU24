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

const createGroupchat = async (groupName) => {
  const currentUser = useUserStore();

  // Create the group
  const { data: createdGroupchat, error: err1 } = await supabase
  .from('Groupchat')
  .insert([{
    name: groupName,
    creator: currentUser.id
  }])
  .select()

  if (err1) {
    console.log(err1);
    return null;
  }

  // Add the creator into it
  const { data, error: err2 } = await supabase
  .from('GroupchatMembers')
  .insert([{
    user: currentUser.id,
    groupchat: createdGroupchat[0].id 
  }])
  .select()

  if (err2) {
    console.log(err2);
    return null;
  }
}

export {
  readUsersGroupchats,
  createGroupchat
};
