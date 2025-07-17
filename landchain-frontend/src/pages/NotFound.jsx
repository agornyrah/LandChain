import React from 'react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-4">Page not found.</p>
      <a href="/" className="text-[#53d22c] underline">Go Home</a>
    </div>
  );
}