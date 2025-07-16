
import { useState } from 'react';

export default function Home() {
  const [friends, setFriends] = useState('');
  const [channels, setChannels] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkChats = async () => {
    setLoading(true);
    const res = await fetch(`/api/check?friends=${friends}&channels=${channels}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Twitch Friend Tracker 👀</h1>
      <label>Amis (séparés par des virgules):</label><br />
      <input style={{ width: '100%', marginBottom: 10 }} value={friends} onChange={e => setFriends(e.target.value)} /><br />
      <label>Streamers (séparés par des virgules):</label><br />
      <input style={{ width: '100%', marginBottom: 10 }} value={channels} onChange={e => setChannels(e.target.value)} /><br />
      <button onClick={checkChats}>Scanner</button>
      {loading && <p>⏳ Scan en cours...</p>}
      {results && (
        <div style={{ marginTop: 20 }}>
          <h2>Résultats :</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
