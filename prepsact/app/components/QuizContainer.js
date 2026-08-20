'use client';

import { useState, useEffect } from 'react';
import MathRenderer from './MathRenderer';
import { useTimer } from '../hooks/useTimer';

export default function QuizContainer({ initialQuestions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  // Set 35 minute timer (35 * 60 = 2100 seconds)
  const { formatted, isExpired } = useTimer(2100);

  // Auto-submit when time expires
  useEffect(() => {
    if (isExpired && !submitted) {
      setSubmitted(true);
      alert("Time's up! Your module has been submitted.");
    }
  }, [isExpired, submitted]);

  const currentQ = initialQuestions[currentIndex];
  
  const handleSelect = (choiceId) => {
    if (submitted) return;
    setSelectedChoices((prev) => ({ ...prev, [currentQ.id]: choiceId }));
  };

  return (
    <div className="space-y-6">
      {/* Timer Header */}
      <div className={`flex justify-between items-center p-4 rounded-lg font-bold shadow-sm ${isExpired ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
        <span>Module Progress: {currentIndex + 1} / {initialQuestions.length}</span>
        <span className="text-xl tracking-widest">⏱ {formatted}</span>
      </div>

      {/* Prompt and Choices (Keeping same logic as before) */}
      <div className="text-lg font-medium text-gray-900">
        <MathRenderer text={currentQ.prompt} />
      </div>

      <div className="space-y-3">
        {currentQ.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleSelect(choice.id)}
            disabled={submitted}
            className={`w-full text-left p-4 border rounded-lg ${
              selectedChoices[currentQ.id] === choice.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            {choice.label}. <MathRenderer text={choice.text} />
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button 
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 border rounded"
        >Previous</button>
        
        {currentIndex < initialQuestions.length - 1 ? (
          <button 
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >Next</button>
        ) : (
          !submitted && (
            <button 
              onClick={() => setSubmitted(true)}
              className="px-6 py-2 bg-green-600 text-white rounded font-bold"
            >Submit Module</button>
          )
        )}
      </div>
    </div>
  );
}
