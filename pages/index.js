import { useState } from 'react';

export default function Home() {
  const [friends, setFriends] = useState('');
  const [channels, setChannels] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult('');
    const res = await fetch(`/api/check?friends=${friends}&channels=${channels}`);
    const data = await res.json();

    if (data.found) {
      setResult(Object.entries(data.found)
        .map(([f, chans]) => chans.length ? `${f} est dans : ${chans.join(', ')}` : `${f} n’est pas en ligne`)
        .join('\n'));
    } else {
      setResult('Erreur ou pas de données trouvées');
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>🔍 Scanner les tchats Twitch</h1>
      <p>Entre les pseudos d’amis et les chaînes Twitch à scanner.</p>

      <div style={{ marginBottom: 20 }}>
        <label>👥 Amis (séparés par des virgules)</label><br />
        <input value={friends} onChange={e => setFriends(e.target.value)} style={{ width: '100%' }} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>📺 Chaînes (séparées par des virgules)</label><br />
        <input value={channels} onChange={e => setChannels(e.target.value)} style={{ width: '100%' }} />
      </div>

      <button onClick={handleCheck} style={{ padding: '10px 20px' }}>
        Lancer le scan
      </button>

      <div style={{ marginTop: 30, whiteSpace: 'pre-wrap' }}>
        {loading ? '🌀 Scan en cours...' : result}
      </div>
    </main>
  );
}
