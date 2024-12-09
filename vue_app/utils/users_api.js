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
  
  if (error) {
    console.log(error);
    return null;
  }

  return data;
}

const readUsersByRelation = async (id, state) => {
  // A logged out user has no friends
  if (id == 0) {
    return [];
  }

  // Select the friendships which the user with given id is in
  const { data: usersFriendships, error } = await supabase
  .from('FriendStatus')
  .select(`
    friend1,
    friend2
  `)
  .or(`friend1.eq.${id},friend2.eq.${id}`)
  .eq('state', state)

  if (error) {
    console.log(error);
    return null;
  }

  // Get a list of users friend ids
  // Flatten the array of objects and remove the user themselfs
  const friendIds = usersFriendships
                    .flatMap(friendship => Object.values(friendship))
                    .filter(friendId => (friendId != id));

  // Retrieve data about users friends
  let friends = [];
  for (const friendId of friendIds) {
    let friend = await readUser(friendId);
    friends.push(friend);
  }

  return friends;
}

// Specific functions to get different kinds of user relations:
const readUsersFriends = async (id) => {
  return await readUsersByRelation(id, 'accepted');
}
const readUsersRequests = async (id) => {
  return await readUsersByRelation(id, 'pending');
}
const readUsersBlocked = async (id) => {
  return await readUsersByRelation(id, 'blocked');
}

// We get which chat belongs to given users by their ids
// In db, the first id is always lower, so this works generally in both orders
const getChatFromUserIds = async (sender, receiver) => {
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

const sendChatMessage = async (sender, receiver, text, recipeId) => {
  const chatId = await getChatFromUserIds(sender, receiver);

  const { data, error } = await supabase
  .from('Message')
  .insert([{
    content: text,
    chat_id: chatId,
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

const ForeignUserRelation = {
  loggedOut: "loggedOut",
  self: "self",
  noRelation: "noRelation",
  pending: "pending",
  accepted: "accepted",
  blocked: "blocked"
}
const getFriendshipState = async (user, peer) => {
  if (user == 0) {
    return ForeignUserRelation.loggedOut;
  }

  if (user == peer) {
    return ForeignUserRelation.self;
  }

  if (user > peer) { // friend1 is is always lower
    let aux = user;
    user = peer;
    peer = aux;
  }

  const { data: state, error } = await supabase
  .from('FriendStatus')
  .select('state')
  .eq('friend1', user)
  .eq('friend2', peer)

  if (error) {
    console.log(error);
    return null;
  }

  if (state.length == 0) { // Assign state according to return
    return ForeignUserRelation.noRelation;
  } else if (state[0].state == "pending") {
    return ForeignUserRelation.pending;
  } else if (state[0].state == "accepted") {
    return ForeignUserRelation.accepted;
  } else if (state[0].state == "blocked") {
    return ForeignUserRelation.blocked;
  }
}

// The chats starts existing here and can be accessed when state is "accepted"
// It is never removed when two people are friends
const sendFriendRequest = async (sender, receiver) => {
  if (sender > receiver) {
    let aux = sender;
    sender = receiver;
    receiver = aux;
  }

  const { statusData, statusError } = await supabase
  .from('FriendStatus')
  .insert([{ 
    friend1: sender,
    friend2: receiver,
    state: "pending"
  }])
  .select()

  if (statusError) {
    console.log(statusError);
    return null;
  }

  // Create chat
  const { chatData, chatError } = await supabase
  .from('Chat')
  .insert([{
    user_1: sender,
    user_2: receiver 
  }])
  .select()

  if (chatError) {
    console.log(chatError);
    return null;
  }

  return statusData;
}

const setFriendState = async(user1, user2, newState) => {
  if (user1 > user2) {
    let aux = user1;
    user1 = user2;
    user2 = aux;
  }

  const { data, error } = await supabase
  .from('FriendStatus')
  .update({
    state: newState
  })
  .eq('friend1', user1)
  .eq('friend2', user2)
  .select()

  if (error) {
    console.log(error);
    return null;
  }

  return data;
}

// Exported encapsulating API functions
const acceptFriendRequest = async(user1, user2) => { // This also works universaly as unblocking
  return await setFriendState(user1, user2, 'accepted');
}
const blockUser = async(user1, user2) => {
  return await setFriendState(user1, user2, 'blocked');
}

const deleteChatHistory = async (user1, user2) => {
  const chatId = await getChatFromUserIds(user1, user2);

  const { error } = await supabase
  .from('Message')
  .delete()
  .eq('chat_id', chatId)

  if (error) {
    console.log(error);
  }
}

export {
  readAllUsers,
  readUser,
  switchUser,
  updateUser,
  readUsersFriends,
  readUsersRequests,
  readUsersBlocked,
  readChat,
  sendChatMessage,
  ForeignUserRelation,
  getFriendshipState,
  sendFriendRequest,
  acceptFriendRequest,
  blockUser,
  deleteChatHistory
};
