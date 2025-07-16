for (const channel of channelList) {
  try {
    const response = await fetch(`https://tmi.twitch.tv/group/user/${channel}/chatters`);

    if (!response.ok) {
      console.warn(`Chaîne "${channel}" inaccessible (status ${response.status})`);
      continue; // passe à la chaîne suivante
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

    friendList.forEach(f => {
      if (chatters.includes(f)) {
        found[f].push(channel);
      }
    });
  } catch (error) {
    console.error(`Erreur lors du fetch pour ${channel}:`, error);
  }
}
