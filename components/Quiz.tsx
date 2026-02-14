
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
      onComplete(responses);
    }
  };

  const handleSelect = (optionId: string) => {
    updateResponse({ selectedOptionId: optionId });
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
    <div className="flex flex-col h-full bg-white">
      <div className="w-full h-2 bg-slate-100">
        <div 
          className="h-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-6 py-6 sm:px-12 sm:py-10 flex flex-col h-full max-h-[85vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <span className="text-slate-400 font-extrabold text-xs tracking-widest uppercase">
            Challenge {currentIndex + 1} / {questions.length}
          </span>
          {currentIndex > 0 && (
            <button onClick={handleBack} className="text-slate-400 hover:text-indigo-600 font-bold text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200">
              ← PREVIOUS
            </button>
          )}
        </div>

        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
          <div className="shrink-0 mb-6">
            {currentQuestion.scenario && (
              <div className="text-base sm:text-lg font-medium text-slate-600 mb-4 leading-relaxed bg-slate-50/80 p-5 rounded-2xl border border-slate-100 whitespace-pre-line shadow-sm">
                {currentQuestion.scenario}
              </div>
            )}
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-[1.15] tracking-tight mb-2">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="flex-grow">
            {currentQuestion.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`w-full text-left py-4 px-5 rounded-2xl border-2 transition-all flex items-start group relative
                      ${currentSelection === option.id 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-800 shadow-md ring-1 ring-indigo-600/20' 
                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 bg-white text-slate-700'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 font-black text-sm transition-colors
                      ${currentSelection === option.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'}
                    `}>
                      {option.id.toUpperCase()}
                    </div>
                    <span className="font-bold text-base sm:text-lg leading-snug pt-0.5">{option.text}</span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'text' && (
              <div className="animate-fadeIn">
                <textarea
                  className="w-full h-48 p-6 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-700 font-medium resize-none mb-6 text-lg"
                  placeholder="Type your strategic rationale here..."
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                />
                <button 
                  onClick={handleNext}
                  disabled={currentText.trim().length < 5}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                >
                  Confirm Response →
                </button>
              </div>
            )}

            {currentQuestion.type === 'hybrid' && currentSelection && (
              <div className="mt-4 animate-fadeIn bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                <label className="block text-xs font-black text-indigo-900 uppercase tracking-widest mb-3">
                  {currentQuestion.followUpPrompt} <span className="text-indigo-400 font-bold ml-1">(OPTIONAL)</span>
                </label>
                <input
                  className="w-full p-4 rounded-xl border-2 border-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-700 font-bold text-base bg-white"
                  placeholder="Briefly explain your nuance..."
                  value={currentFollowUp}
                  onChange={(e) => setCurrentFollowUp(e.target.value)}
                />
                <button 
                  onClick={handleNext}
                  className="w-full mt-6 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                >
                  Continue to Next Question →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
