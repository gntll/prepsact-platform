'use client';
import { useState } from 'react';

export default function Home() {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <main className="max-w-2xl mx-auto p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">SAT Digital Simulator</h1>

      <div className="border border-gray-300 p-6 rounded-lg mb-6 shadow-sm">
        <div className="flex justify-between mb-4 text-sm font-bold text-gray-600">
          <span>Module 1: Math</span>
          <span className="text-red-600">⏱ 35:00</span>
        </div>

        <p className="text-lg mb-4">If $3x - 5 = 16$, what is the value of $x$?</p>

        <div className="space-y-3">
          {['5', '7', '9', '11'].map((opt) => (
            <label
              key={opt}
              className="block p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="sat-question"
                value={opt}
                checked={selectedOption === opt}
                onChange={() => setSelectedOption(opt)}
                className="mr-3"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="bg-blue-600 text-white px-6 py-2 rounded font-bold w-full hover:bg-blue-700 transition"
      >
        Submit Module
      </button>
    </main>
  );
}
