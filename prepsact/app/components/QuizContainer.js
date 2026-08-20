'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MathRenderer from './MathRenderer';
import { useTimer } from '../hooks/useTimer';
import { estimateAbility } from '../utils/irtScoring';

export default function QuizContainer({ initialQuestions }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  // Set 35 minute timer (35 * 60 = 2100 seconds)
  const { formatted, isExpired } = useTimer(2100);

  // Auto-submit when time expires
  useEffect(() => {
    if (isExpired && !submitted) {
      setSubmitted(true);
      alert("Time's up! Your module is being submitted.");
      handleFinalSubmit();
    }
  }, [isExpired, submitted]);

  if (!initialQuestions || initialQuestions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
        No questions found in database. Please run the seeder or add questions via the Admin CMS.
      </div>
    );
  }

  const currentQ = initialQuestions[currentIndex];
  const selectedChoiceId = selectedChoices[currentQ.id];

  const handleSelect = (choiceId) => {
    if (submitted) return;
    setSelectedChoices((prev) => ({
      ...prev,
      [currentQ.id]: choiceId,
    }));
  };

  const handleFinalSubmit = () => {
    setSubmitted(true);

    // Format responses for IRT calculation
    const userResponses = initialQuestions.map((q) => {
      const chosenChoiceId = selectedChoices[q.id];
      const correctChoice = q.choices.find((c) => c.isCorrect);
      const isCorrect = chosenChoiceId === correctChoice?.id;

      return {
        isCorrect,
        difficulty: q.difficulty,
        discrimination: q.discrimination || 1.0,
        guessing: q.guessing || 0.25,
      };
    });

    const rawCorrect = userResponses.filter((r) => r.isCorrect).length;
    const { theta, scaledScore } = estimateAbility(userResponses);

    // Redirect to results dashboard with parameters
    router.push(`/results?score=${rawCorrect}/${initialQuestions.length}&scaled=${scaledScore}&theta=${theta}`);
  };

  return (
    <div className="space-y-6">
      {/* Timer Header Bar */}
      <div className={`flex justify-between items-center p-4 rounded-lg font-bold shadow-sm ${isExpired ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
        <span>Question {currentIndex + 1} of {initialQuestions.length} ({currentQ.section})</span>
        <span className="text-xl tracking-widest">⏱ {formatted}</span>
      </div>

      {/* Domain Badge */}
      <div className="text-sm font-semibold text-blue-600">
        Domain: {currentQ.domain} — Difficulty: {currentQ.difficulty}
      </div>

      {/* Passage (if present) */}
      {currentQ.passage && (
        <div className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded text-gray-800 leading-relaxed text-sm">
          <MathRenderer text={currentQ.passage} />
        </div>
      )}

      {/* Prompt */}
      <div className="text-lg font-medium text-gray-900">
        <MathRenderer text={currentQ.prompt} />
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        {currentQ.choices.map((choice) => {
          const isSelected = selectedChoiceId === choice.id;
          let styleClass = "border-gray-200 hover:bg-gray-50";

          if (isSelected) styleClass = "border-blue-500 bg-blue-50";

          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => handleSelect(choice.id)}
              disabled={submitted}
              className={`w-full text-left p-4 border rounded-lg transition flex items-center gap-3 ${styleClass}`}
            >
              <span className="font-bold text-gray-500">{choice.label}.</span>
              <MathRenderer text={choice.text} />
            </button>
          );
        })}
      </div>

      {/* Navigation and Submission Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="px-4 py-2 border rounded font-medium disabled:opacity-40"
        >
          Previous
        </button>

        {currentIndex < initialQuestions.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          !submitted && (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition"
            >
              Submit Test & Score
            </button>
          )
        )}
      </div>
    </div>
  );
}
