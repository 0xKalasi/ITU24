import { supabase } from "./supabase";
import { useUserStore } from '../src/stores/userStore';
import { readUser } from "./users_api";

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

const readGroupchatMessages = async (id) => {  
  const { data: Messages, error } = await supabase
  .from('Message')
  .select(`
    *,
    Recipe (name),
    User (*)
  `)
  .eq('groupchat_id', id)
  .order('created_at', { ascending: true })

  if (error) {
    console.log(error);
    return null;
  }

  return Messages;
}

// probably will be unused
const readGroupchatMembers = async (id) => {
  const { data: memberIds, error } = await supabase
  .from('GroupchatMembers')
  .select('user')
  .eq('groupchat', id)

  if (error) {
    console.log(error);
    return null;
  }

  let members = [];
  for (const memberId of memberIds) {
    let user = await readUser(memberId.user);
    members.push(user);
  }

  return members;        
}

const sendGroupchatMessage = async (sender, groupchatId, text, recipeId) => {
  const { data, error } = await supabase
  .from('Message')
  .insert([{
    content: text,
    groupchat_id: groupchatId,
    person_posted: sender,
    recipe_id: recipeId
  }])
  .select()
  
  if (error) {
    console.log(error);
    return null;
  }

  return data;
}

const updateGroupName = async (groupId, newName) => {
  const { data, error } = await supabase
  .from('Groupchat')
  .update({
    name: newName
  })
  .eq('id', groupId)
  .select()
  
  if (error) {
    console.log(error);
    return null;
  }

  return data;
}

const removeUserFromGroup = async (userId, groupId) => {
  const { error } = await supabase
  .from('GroupchatMembers')
  .delete()
  .eq('user', userId)
  .eq('groupchat', groupId)

  if (error) {
    console.log(error);
  }
}

const addUserToGroup = async (userId, groupId) => {
  const { data, error } = await supabase
  .from('GroupchatMembers')
  .insert([{
    user: userId,
    groupchat: groupId
  }])
  .select()
  
  if (error) {
    console.log(error);
    return null;
  }

  return data;
}

export {
  readGroupchat,
  readUsersGroupchats,
  createGroupchat,
  readGroupchatMessages,
  readGroupchatMembers,
  sendGroupchatMessage,
  updateGroupName,
  removeUserFromGroup,
  addUserToGroup
};
