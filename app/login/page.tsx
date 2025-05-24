// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const PASSWORD = 'pastigacor_hoki303@#$';

  const handleLogin = () => {
    if (password === PASSWORD) {
      document.cookie = `access=true; path=/`;
      router.push('/');
    } else {
      alert('Wrong password');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Enter Access Password</h1>
      <input
        className="p-2 text-black mb-2"
        type="password"
        placeholder="Password..."
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 px-4 py-2" onClick={handleLogin}>
        Login
      </button>
    </main>
  );
}
