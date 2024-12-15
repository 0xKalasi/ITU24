// Martin Jabůrek, xjabur02

import { supabase } from "./supabase";

// Channel names are not needed in UI, they are generated automatically
const channelNames = {
  id: 0,

  getNewName() {
    let name = `supabase-channel-${this.id}`;
    this.id += 1;
    return name;
  }
};

const createSubscription = async (listenEvent, listenTable, action) => {
  let channel = supabase
  .channel(channelNames.getNewName())
  .on(
    'postgres_changes',
    { event: listenEvent, schema: 'public', table: listenTable },
    async (payload) => {
      await action();
    }
  )
  .subscribe();

  return channel;
}

const removeSubscription = async (channel) => {
  if (channel) {
    await channel.unsubscribe(); // This is a possible alternative
    //supabase.removeChannel(channel);
  }
}

export {
  createSubscription,
  removeSubscription
};
