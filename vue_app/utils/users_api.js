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

const readUsersFriends = async (id) => {
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
  .eq('state', 'accepted')

  if (error) {
    console.log(error);
    return null;
  }

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

const readUsersRequests = async (id) => {
  if (id == 0) {
    return [];
  }

  const { data: usersFriendships, error } = await supabase
  .from('FriendStatus')
  .select(`
    friend1,
    friend2
  `)
  .or(`friend1.eq.${id},friend2.eq.${id}`)
  .eq('state', 'pending')
  .neq('sender', id)

  if (error) {
    console.log(error);
    return null;
  }

  const friendIds = usersFriendships
                    .flatMap(friendship => Object.values(friendship))
                    .filter(friendId => (friendId != id));

  let friends = [];
  for (const friendId of friendIds) {
    let friend = await readUser(friendId);
    friends.push(friend);
  }

  return friends;
}

const readUsersBlocked = async (id) => {
  if (id == 0) {
    return [];
  }

  const { data: usersFriendships, error } = await supabase
  .from('FriendStatus')
  .select(`
    friend1,
    friend2
  `)
  .or(`friend1.eq.${id},friend2.eq.${id}`)
  .eq('state', 'blocked')
  .eq('blocker', id) // Only give users I blocked

  if (error) {
    console.log(error);
    return null;
  }

  const friendIds = usersFriendships
                    .flatMap(friendship => Object.values(friendship))
                    .filter(friendId => (friendId != id));

  let friends = [];
  for (const friendId of friendIds) {
    let friend = await readUser(friendId);
    friends.push(friend);
  }

  return friends;
}

// We get which chat belongs to given users by their ids
// In DB, the first id is always lower, so this works generally in both orders
const getChatFromUserIds = async (sender, receiver) => {
  // Ids of users in chats are always such that user_1 is smaller than user_2
  const { data: Chat, error } = await supabase
  .from('Chat')
  .select('id')
  .eq('user_1', Math.min(sender, receiver))
  .eq('user_2', Math.max(sender, receiver))

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
    Recipe (name),
    User (*)
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
  LOGGED_OUT: "loggedOut",
  SELF: "self",
  NO_RELATION: "noRelation",
  SENT: "sent", // I sent the request
  PENDING: "pending", // I received the request
  ACCEPTED: "accepted",
  BLOCKED_BY_THEM: "blockedByThem",
  BLOCKED_BY_ME: "blockedByMe"
}
const getFriendshipState = async (user, peer) => {
  if (user == 0) {
    return ForeignUserRelation.LOGGED_OUT;
  }

  if (user == peer) {
    return ForeignUserRelation.SELF;
  }

  const { data: state, error } = await supabase
  .from('FriendStatus')
  .select(`state, sender, blocker`)
  .eq('friend1', Math.min(user, peer))
  .eq('friend2', Math.max(user, peer))

  if (error) {
    console.log(error);
    return null;
  }

  if (state.length == 0) { // Assign state according to return
    return ForeignUserRelation.NO_RELATION;
  } else if (state[0].state == "pending") {
    if (state[0].sender == user) {
      return ForeignUserRelation.SENT;
    } else {
      return ForeignUserRelation.PENDING;
    }
  } else if (state[0].state == "accepted") {
    return ForeignUserRelation.ACCEPTED;
  } else if (state[0].state == "blocked") {
    if (state[0].blocker == user) {
      return ForeignUserRelation.BLOCKED_BY_ME;  
    } else {
      return ForeignUserRelation.BLOCKED_BY_THEM;
    }
  }
}

// The chats starts existing here and can be accessed when state is "accepted"
// It is never removed when two people are friends
const sendFriendRequest = async (sender, receiver) => {
  const now = new Date().toISOString();

  const { statusData, statusError } = await supabase
  .from('FriendStatus')
  .insert([{ 
    friend1: Math.min(sender, receiver),
    friend2: Math.max(sender, receiver),
    state: "pending",
    sender: sender
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
    user_1: Math.min(sender, receiver),
    user_2: Math.max(sender, receiver),
    user_1_last_viewed: now,
    user_2_last_viewed: now
  }])
  .select()

  if (chatError) {
    console.log(chatError);
    return null;
  }

  return statusData;
}

const acceptFriendRequest = async(user1, user2) => {
  const { data, error } = await supabase
  .from('FriendStatus')
  .update({
    state: 'accepted'
  })
  .eq('friend1', Math.min(user1, user2))
  .eq('friend2', Math.max(user1, user2))
  .select()

  if (error) {
    console.log(error);
    return null;
  }

  return data;
}

const blockUser = async(user, peer) => {
  const { data, error } = await supabase
  .from('FriendStatus')
  .update({
    state: 'blocked',
    blocker: user
  })
  .eq('friend1', Math.min(user, peer))
  .eq('friend2', Math.max(user, peer))
  .select()

  if (error) {
    console.log(error);
    return null;
  }

  return data;
}

const unblockUser = async (user, peer) => {
  const { data, error } = await supabase
  .from('FriendStatus')
  .update({
    state: 'accepted',
    blocker: null
  })
  .eq('friend1', Math.min(user, peer))
  .eq('friend2', Math.max(user, peer))
  .select()

  if (error) {
    console.log(error);
    return null;
  }

  return data;
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

// We need to first get the chat of the two users that are together
const getUnseenMessageCount = async (user, peer) => {
  const chatId = await getChatFromUserIds(user, peer);

  const { data: Chat, error: err1 } = await supabase
  .from('Chat')
  .select('*')
  .eq('id', chatId)

  if (err1) {
    console.log(err1);
    return null;
  }

  const chat = Chat[0];

  // Get when the user saw the chat last time
  let lastTimeOpened;
  if (user == chat.user_1) {
    lastTimeOpened = chat.user_1_last_viewed;
  } else {
    lastTimeOpened = chat.user_2_last_viewed;
  }

  let { data: count, error: err2 } = await supabase
  .from('Message')
  .select('count')
  .eq('chat_id', chat.id)
  .gt('created_at', lastTimeOpened)
  
  if (err2) {
    console.log(err2);
    return null;
  }

  return count[0].count;
}

const setLastTimeSeenForChat = async (user, peer) => {
  const chatId = await getChatFromUserIds(user, peer);

  const now = new Date().toISOString();

  if (user < peer) {
    const { data, error } = await supabase
    .from('Chat')
    .update({ user_1_last_viewed: now })
    .eq('id', chatId)
    .select()

    if (error) {
      console.log(error);
    }

  } else {
    const { data, error } = await supabase
    .from('Chat')
    .update({ user_2_last_viewed: now })
    .eq('id', chatId)
    .select()

    if (error) {
      console.log(error);
    }
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
  unblockUser,
  deleteChatHistory,
  getUnseenMessageCount,
  setLastTimeSeenForChat
};
