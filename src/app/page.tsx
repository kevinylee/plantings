"use client";

import { useState } from 'react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center flex-column justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text 3xl font-bold">Soil 🌱</h1>
      <section>
        <label>Amount (USD)</label>
        <input 
          className="border rounded"
          type="number"
          min="1"
          step="0.01"
        />
      </section>      
      <button className="btn" type="submit">Plant</button>
    </div>
  );
}
