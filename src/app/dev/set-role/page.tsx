"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function SetRolePage() {
  const router = useRouter();

  const setRole = (role: string) => {
    document.cookie = `role=${role}; path=/`;
    router.push('/');
  };

  return (
    <div className="p-20 text-center space-y-4">
      <h1 className="text-2xl font-bold mb-8">Set Your Role</h1>
      <button className="block w-full max-w-sm mx-auto bg-gray-200 p-4 rounded hover:bg-gray-300 text-black" onClick={() => setRole('viewer')}>I am a Viewer</button>
      <button className="block w-full max-w-sm mx-auto bg-blue-200 p-4 rounded hover:bg-blue-300 text-black" onClick={() => setRole('editor')}>I am an Editor</button>
      <button className="block w-full max-w-sm mx-auto bg-green-200 p-4 rounded hover:bg-green-300 text-black" onClick={() => setRole('publisher')}>I am a Publisher</button>
    </div>
  );
}
