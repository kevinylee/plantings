"use client";

import { useState } from 'react';


export default function Home() {
  // the live typing state
  const [liveValue, setLiveValue] = useState("");
  // Submitted state amount value
  const [finalInputValue, setInputValue] = useState("");

  // Handle changes in inpur field (to update the state)
  const handleLiveChange = (event) => {
    setLiveValue(event.target.value);
  };

  // Handle the button click (submits dollar amount)
  const handleClick = (event) => {
    event.preventDefault();
    setInputValue(liveValue);
  };

  return (
    <div className="flex min-h-screen flex-col items-center flex-column justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text 3xl font-bold">Soil 🌱</h1>
      <form className="flex flex-col">
        <label>How much do you want to plant?</label>

        <input
          required
          value={liveValue}
          onChange={handleLiveChange}
          placeholder="Dollar Amount..."
          id="donation"
          className="border rounded"
          type="number"
          min="1"
          step="0.01"
        />
        <button onClick={handleClick} className="rounded bg-black text-white dark:bg-white dark:text-black">Plant</button>
      </form>
      <p>Amount:{finalInputValue}</p>
    </div>
  );
}
