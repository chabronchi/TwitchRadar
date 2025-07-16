
import tmi from 'tmi.js';

export default async function handler(req, res) {
  const { friends, channels } = req.query;

  if (!friends || !channels) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const friendList = friends.toLowerCase().split(',').map(f => f.trim());
  const channelList = channels.toLowerCase().split(',').map(c => c.trim());

  const found = {};
  friendList.forEach(f => found[f] = []);

  const client = new tmi.Client({
    connection: { reconnect: true },
    channels: channelList,
  });

  await client.connect();

  const checkUsersInChat = async () => {
    for (const channel of channelList) {
      try {
        const users = await client.api.callApi({
          url: \`https://tmi.twitch.tv/group/user/\${channel}/chatters\`,
        });
        const chatters = users.chatters.viewers.concat(users.chatters.moderators || []);
        friendList.forEach(f => {
          if (chatters.includes(f)) {
            found[f].push(channel);
          }
        });
      } catch (e) {
        console.error('Erreur pour le channel', channel, e);
      }
    }
  };

  await checkUsersInChat();
  await client.disconnect();

  res.status(200).json(found);
}
