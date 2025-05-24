'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [urls, setUrls] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Record<string, string>>({});
  const [lastCheck, setLastCheck] = useState<Record<string, string>>({});
  const [redirectedTo, setRedirectedTo] = useState<Record<string, string | null>>({});
  const [autorefresh, setAutorefresh] = useState(true);
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  const PASSWORD = 'pastigacor_hoki303@#$';

  useEffect(() => {
    if (autorefresh && unlocked) {
      const interval = setInterval(() => {
        urls.forEach(checkUrl);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [urls, autorefresh, unlocked]);

  useEffect(() => {
    if (unlocked) {
      const stored = localStorage.getItem('khab555_urls');
      if (stored) {
        const saved = JSON.parse(stored);
        setUrls(saved);
        saved.forEach(checkUrl);
      }
    }
  }, [unlocked]);

  const checkUrl = async (url: string) => {
    try {
      const res = await fetch(`/api/check?url=${encodeURIComponent(url)}`);
      const json = await res.json();

      setStatus(prev => ({ ...prev, [url]: json.status }));
      setLastCheck(prev => ({ ...prev, [url]: new Date().toLocaleTimeString() }));
      setRedirectedTo(prev => ({ ...prev, [url]: json.redirectedTo || null }));
    } catch {
      setStatus(prev => ({ ...prev, [url]: 'error' }));
      setRedirectedTo(prev => ({ ...prev, [url]: null }));
    }
  };

  const startMonitoring = () => {
    const lines = input
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
    const newUrls = Array.from(new Set([...urls, ...lines]));
    setUrls(newUrls);
    localStorage.setItem('khab555_urls', JSON.stringify(newUrls));
    lines.forEach(checkUrl);
    setInput('');
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  };

  const getFavicon = (url: string) => {
    const domain = getDomain(url);
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
  };

  const handleUnlock = () => {
    if (password === PASSWORD) {
      setUnlocked(true);
      setPassword('');
    }
  };

  if (!unlocked) {
    return (
      <div className="p-6 max-w-md mx-auto flex flex-col items-center gap-4">
        <h1 className="text-xl font-bold">🔐 Enter Access Password</h1>
        <input
          className="p-2 text-black w-full rounded-md"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
          onClick={handleUnlock}
        >
          Unlock
        </button>
      </div>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">KHAB555 Redirect Monitor</h1>

      <textarea
        className="w-full h-40 text-black p-2 rounded-md"
        placeholder="Paste URLs here, one per line..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 mt-2 rounded-md"
        onClick={startMonitoring}
      >
        ➕ Start Monitoring
      </button>

      <div className="mt-6 space-y-2">
        {urls.map(url => (
          <div
            key={url}
            className="flex items-center justify-between bg-gray-900 px-3 py-2 rounded-md shadow-sm"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <img src={getFavicon(url)} alt="icon" className="w-5 h-5" />
              <span className="truncate max-w-xs">{url}</span>
            </div>
            <div className="flex flex-col items-end text-sm text-right max-w-xs overflow-hidden">
              <span
                className={
                  status[url] === '200'
                    ? 'text-green-500 font-bold'
                    : status[url] === 'redirect'
                    ? 'text-yellow-400 font-bold'
                    : status[url] === 'error'
                    ? 'text-red-500 font-bold'
                    : 'text-gray-400'
                }
              >
                {status[url] || 'Checking...'}
              </span>
              {status[url] === 'redirect' && redirectedTo[url] && (
                <a
                  href={redirectedTo[url] || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 underline truncate"
                  title={redirectedTo[url] || ''}
                >
                  ↪ {redirectedTo[url]}
                </a>
              )}
              <span className="text-gray-400 text-xs">{lastCheck[url]}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 underline text-sm text-blue-300"
        onClick={() => setAutorefresh(prev => !prev)}
      >
        {autorefresh ? '⏸ Pause Auto-Refresh' : '▶️ Resume Auto-Refresh'}
      </button>

      <button
  className="mt-2 underline text-sm text-red-400"
  onClick={() => {
    setUrls([]);
    localStorage.removeItem('khab555_urls');
  }}
>
  🧼 Clear All Monitored URLs
</button>
    </main>
  );
}
