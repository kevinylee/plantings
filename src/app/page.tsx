"use client";

import { useState } from 'react';


export default function Home() {
  // the live typing amount, string for the input
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false); // this is to prevent resubmits. Show redirecting. Disable button while processing.

  // when the the user clicks "Plant"
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // convert amount string to number type
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true); // loading once number is accepted
    try {
      const res = await fetch("api/checkout", {
        method: "POST",
        headers: {"Content-Type": "applications/json"},
        body: JSON.stringify({ amount: num }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Planting failed");

      window.location.href = data.url; // Stripe checkout URL
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  // // Handle changes in inpur field (to update the state)
  // const handleLiveChange = (event) => {
  //   setLiveValue(event.target.value);
  // };

  // // Handle the button click (submits dollar amount)
  // const handleClick = (event) => {
  //   event.preventDefault();
  //   setInputValue(liveValue);
  // };

  return (
    <div className="flex min-h-screen flex-col items-center flex-column justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text 3xl font-bold">Soil 🌱</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label>How much do you want to plant?</label>

        <input
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Dollar Amount..."
          id="donation"
          className="border rounded"
          type="number"
          min="1"
          step="0.01"
        />
        <button disabled={loading} className="rounded bg-black text-white dark:bg-white dark:text-black">
          {loading ? "Redirecting..." : "Plant"}
        </button>
      </form>
      <p>Amount:{amount}</p>
    </div>
  );
}
