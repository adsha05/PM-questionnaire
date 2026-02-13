
import React, { useState, useEffect } from 'react';
import { Question, UserResponse } from '../types';

interface QuizProps {
  questions: Question[];
  onComplete: (responses: UserResponse[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<UserResponse[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [currentFollowUp, setCurrentFollowUp] = useState('');

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const getResponse = (id: number) => responses.find(r => r.questionId === id);

  const updateResponse = (data: Partial<UserResponse>) => {
    const newResponses = [...responses];
    const index = newResponses.findIndex(r => r.questionId === currentQuestion.id);
    if (index > -1) {
      newResponses[index] = { ...newResponses[index], ...data };
    } else {
      newResponses.push({ questionId: currentQuestion.id, ...data });
    }
    setResponses(newResponses);
  };

  const handleNext = () => {
    // Collect text values if any
    if (currentQuestion.type === 'text') {
      updateResponse({ textValue: currentText });
    }
    if (currentQuestion.type === 'hybrid' && currentQuestion.followUpPrompt) {
      updateResponse({ followUpValue: currentFollowUp });
    }

    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      const nextRes = responses.find(r => r.questionId === nextQ.id);
      setCurrentText(nextRes?.textValue || '');
      setCurrentFollowUp(nextRes?.followUpValue || '');
      setCurrentIndex(currentIndex + 1);
    } else {
      // Small buffer to ensure states are flushed
      onComplete(responses);
    }
  };

  const handleSelect = (optionId: string) => {
    updateResponse({ selectedOptionId: optionId });
    // User requested auto-advance upon selection
    setTimeout(handleNext, 400);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevQ = questions[currentIndex - 1];
      const prevRes = responses.find(r => r.questionId === prevQ.id);
      setCurrentText(prevRes?.textValue || '');
      setCurrentFollowUp(prevRes?.followUpValue || '');
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentSelection = getResponse(currentQuestion.id)?.selectedOptionId;

  return (
    <div className="flex flex-col h-[700px] bg-white">
      <div className="w-full h-1.5 bg-slate-100">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-8 sm:p-12 flex flex-col flex-grow overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">
            Question {currentIndex + 1} of {questions.length}
          </span>
          {currentIndex > 0 && (
            <button onClick={handleBack} className="text-slate-400 hover:text-indigo-600 font-semibold text-xs transition-colors px-2 py-1 rounded hover:bg-slate-50">
              ← BACK
            </button>
          )}
        </div>

        <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
          <div className="mb-10 animate-fadeIn">
            {currentQuestion.scenario && (
              <p className="text-base font-medium text-slate-500 mb-4 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {currentQuestion.scenario}
              </p>
            )}
            <h3 className="text-2xl font-black text-slate-900 leading-tight">
              {currentQuestion.question}
            </h3>
          </div>

          {currentQuestion.options && (
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center group
                    ${currentSelection === option.id 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-200 bg-white text-slate-600'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 font-bold text-sm
                    ${currentSelection === option.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}
                  `}>
                    {option.id.toUpperCase()}
                  </div>
                  <span className="font-bold text-sm leading-snug">{option.text}</span>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'text' && (
            <div className="animate-fadeIn">
              <textarea
                className="w-full h-40 p-6 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-700 font-medium resize-none mb-4"
                placeholder="Be honest. What was the signal everyone ignored?"
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
              />
              <button 
                onClick={handleNext}
                disabled={currentText.trim().length < 5}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
              >
                Continue →
              </button>
            </div>
          )}

          {currentQuestion.type === 'hybrid' && currentSelection && (
            <div className="mt-8 animate-fadeIn">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                {currentQuestion.followUpPrompt} (Optional)
              </label>
              <input
                className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-700 font-medium"
                placeholder="Brief nuance if you want..."
                value={currentFollowUp}
                onChange={(e) => setCurrentFollowUp(e.target.value)}
                onBlur={handleNext} // Auto-advance when they move away from the optional follow-up
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
