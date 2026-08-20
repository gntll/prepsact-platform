'use client';

import { useState } from 'react';
import { createQuestion } from '../actions/questionActions';

export default function AdminForm() {
  const [choices, setChoices] = useState([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ]);
  const [message, setMessage] = useState('');

  const handleChoiceChange = (index, text) => {
    const updated = [...choices];
    updated[index].text = text;
    setChoices(updated);
  };

  const handleCorrectChange = (index) => {
    const updated = choices.map((c, i) => ({
      ...c,
      isCorrect: i === index,
    }));
    setChoices(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    const formData = new FormData(e.target);
    formData.append('choices', JSON.stringify(choices));

    try {
      await createQuestion(formData);
      setMessage('Question successfully added to database!');
      e.target.reset();
      setChoices([
        { text: '', isCorrect: true },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    } catch (err) {
      setMessage('Error: Failed to save question.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Section</label>
          <select name="section" className="w-full p-2 border rounded">
            <option value="MATH">Math</option>
            <option value="READING_WRITING">Reading & Writing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Difficulty</label>
          <select name="difficulty" className="w-full p-2 border rounded">
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Domain</label>
        <input name="domain" type="text" placeholder="e.g., Algebra, Craft and Structure" className="w-full p-2 border rounded" required />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Reading Passage (Optional)</label>
        <textarea name="passage" placeholder="Paste reading passage here if applicable..." className="w-full p-2 border rounded h-24" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Question Prompt (Supports LaTeX like $3x - 5$)</label>
        <textarea name="prompt" placeholder="Enter question prompt..." className="w-full p-2 border rounded h-24" required />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold">Answer Choices (Select the radio button for the correct answer)</label>
        {choices.map((choice, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="radio"
              name="correctChoice"
              checked={choice.isCorrect}
              onChange={() => handleCorrectChange(index)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="font-bold text-gray-700">{['A', 'B', 'C', 'D'][index]}.</span>
            <input
              type="text"
              value={choice.text}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              placeholder={`Choice ${['A', 'B', 'C', 'D'][index]} text`}
              className="flex-1 p-2 border rounded"
              required
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Explanation (Optional)</label>
        <textarea name="explanation" placeholder="Step-by-step solution breakdown..." className="w-full p-2 border rounded h-20" />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition">
        Save Question to Database
      </button>

      {message && (
        <p className={`text-center font-medium p-3 rounded ${message.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
