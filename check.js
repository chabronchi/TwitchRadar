export default async function handler(req, res) {
  const { friends, channels } = req.query;

  if (!friends || !channels) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const friendList = friends.toLowerCase().split(',').map(f => f.trim());
  const channelList = channels.toLowerCase().split(',').map(c => c.trim());

  const found = {};
  friendList.forEach(f => found[f] = []);

  for (const channel of channelList) {
    try {
      const response = await fetch(`https://tmi.twitch.tv/group/user/${channel}/chatters`);
      const data = await response.json();

      const chatters = [
        ...(data.chatters?.viewers || []),
        ...(data.chatters?.moderators || []),
        ...(data.chatters?.vips || []),
        ...(data.chatters?.staff || []),
        ...(data.chatters?.admins || []),
        ...(data.chatters?.global_mods || [])
      ];

      friendList.forEach(f => {
        if (chatters.includes(f)) {
          found[f].push(channel);
        }
      });
    } catch (error) {
      console.error(`Erreur lors du fetch pour ${channel}:`, error);
    }
  }

  res.status(200).json({ status: 'ok', found });
}
