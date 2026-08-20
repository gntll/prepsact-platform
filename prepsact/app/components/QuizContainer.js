'use client';

import { useState } from 'react';
import MathRenderer from './MathRenderer';

export default function QuizContainer({ initialQuestions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!initialQuestions || initialQuestions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
        No questions found in database. Please run the seeder.
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

  const calculateScore = () => {
    let correct = 0;
    initialQuestions.forEach((q) => {
      const chosen = q.choices.find((c) => c.id === selectedChoices[q.id]);
      if (chosen && chosen.isCorrect) correct += 1;
    });
    return correct;
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="flex justify-between items-center text-sm font-semibold text-gray-600 bg-gray-100 p-3 rounded-md">
        <span>Question {currentIndex + 1} of {initialQuestions.length} ({currentQ.section})</span>
        <span className="text-blue-600">{currentQ.domain} — {currentQ.difficulty}</span>
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
          if (submitted) {
            if (choice.isCorrect) {
              styleClass = "border-green-500 bg-green-50 text-green-900 font-semibold";
            } else if (isSelected && !choice.isCorrect) {
              styleClass = "border-red-500 bg-red-50 text-red-900";
            }
          }

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

      {/* Explanation when submitted */}
      {submitted && currentQ.explanation && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          <strong>Explanation:</strong> <MathRenderer text={currentQ.explanation} />
        </div>
      )}

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
              onClick={() => setSubmitted(true)}
              className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700"
            >
              Submit Test
            </button>
          )
        )}
      </div>

      {submitted && (
        <div className="p-4 bg-green-100 border border-green-300 rounded text-center text-green-900 font-bold">
          Score: {calculateScore()} / {initialQuestions.length} Correct
        </div>
      )}
    </div>
  );
}
