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

  // switching concerns local store - currently active user
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

const updateUser = async (id, name, bio) => {
  // update DB
  const { data, error } = await supabase
    .from('User')
    .update({ name: name, bio: bio })
    .eq('id', id)
    .select()

  // update local store
  const userStore = useUserStore();
  userStore.name = name;
  userStore.bio = bio;

  // TODO: what should I return????

  if (error) {
    console.log(error);
    return null;
  }

  return;
}

// TODO works very weirdly...
const readUsersFriends = async (id) => {
  const { data: friendStatus, error } = await supabase
  .from('FriendStatus')
  .select(`
    state,
    User:friend2 (id, name, bio)
  `)
  .eq('friend1', id)

  if (error) {
    console.log(error);
    return null;
  }

  return friendStatus;
}

// Find all messages in chat by its id
const getChatFromUserIds = async (sender, receiver) => {
  // TODO extremely stupid, maybe there is a better way ???
  // user 1 has always smaller id then user 2
  if (sender > receiver) {
    let aux = sender;
    sender = receiver;
    receiver = aux;
  }

  // Find chat id
  const { data: Chat, error } = await supabase
  .from('Chat')
  .select('id')
  .eq('user_1', sender)
  .eq('user_2', receiver)

  if (error) {
    console.log(error);
    return null;
  }

  return Chat[0].id;
}

const readChat = async (sender, receiver) => {
  const chatId = await getChatFromUserIds(sender, receiver);

  //console.log(chatId);

  const { data: Messages, error } = await supabase
  .from('Message')
  .select(`
    *,
    Recipe (name)
  `)
  .eq('chat_id', chatId)
  .order('created_at', { ascending: true })

  if (error) {
    console.log(error);
    return null;
  }

  return Messages;
}

const sendChatMessage = async (sender, receiver, text) => {
  const chatId = await getChatFromUserIds(sender, receiver);

  const { data, error } = await supabase
  .from('Message')
  .insert([{
    content: text,
    chat_id: chatId,
    person_posted: sender
  }])
  .select()
  
  if (error) {
    console.log(error);
    return null;
  }

  return;
}

//const acceptFriendRequest = async (status) => {
//  const { data, error } = await supabase
//  .from('FriendStatus')
//  .update({ other_column: 'otherValue' })
//  .eq('some_column', 'someValue')
//  .select()      
//}

//const getFriendRequestCount = async (userId) => {
//  console.log("HERE");
//
//  return "7";
//}

export {
  readAllUsers,
  readUser,
  switchUser,
  updateUser,
  readUsersFriends,
  readChat,
  sendChatMessage,
};
