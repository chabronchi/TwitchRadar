export default async function handler(req, res) {
  const { friends = '', channels = '' } = req.query;

  const friendList = friends.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  const channelList = channels.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

  const found = {};
  friendList.forEach(f => found[f] = []);

  for (const channel of channelList) {
    try {
      const response = await fetch(`https://tmi.twitch.tv/group/user/${channel}/chatters`);

      if (!response.ok) {
        console.warn(`Chaîne "${channel}" inaccessible (status ${response.status})`);
        continue;
      }

      const data = await response.json();

      const chatters = [
        ...(data.chatters?.viewers || []),
        ...(data.chatters?.moderators || []),
        ...(data.chatters?.vips || []),
        ...(data.chatters?.staff || []),
        ...(data.chatters?.admins || []),
        ...(data.chatters?.global_mods || [])
      ];

      friendList.forEach(friend => {
        if (chatters.includes(friend)) {
          found[friend].push(channel);
        }
      });
    } catch (error) {
      console.error(`Erreur lors du fetch pour ${channel}:`, error);
    }
  }

  res.status(200).json({ status: 'ok', found });
}
