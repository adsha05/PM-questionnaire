
import React, { useState } from 'react';
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

  const upsertResponse = (
    baseResponses: UserResponse[],
    questionId: number,
    data: Partial<UserResponse>
  ) => {
    const newResponses = [...baseResponses];
    const index = newResponses.findIndex(r => r.questionId === questionId);
    if (index > -1) {
      newResponses[index] = { ...newResponses[index], ...data };
    } else {
      newResponses.push({ questionId, ...data });
    }
    return newResponses;
  };

  const handleSelect = (optionId: string) => {
    setResponses(prev => upsertResponse(prev, currentQuestion.id, { selectedOptionId: optionId }));
    if (currentQuestion.type === 'choice') {
      setTimeout(() => handleNext(optionId), 400);
    }
  };

  const handleNext = (forcedSelection?: string) => {
    const selectedOption = forcedSelection || currentSelection;
    const responsePatch: Partial<UserResponse> = {
      ...(selectedOption ? { selectedOptionId: selectedOption } : {})
    };

    if (currentQuestion.type === 'text') {
      responsePatch.textValue = currentText.trim();
    }
    if (currentQuestion.type === 'hybrid' && currentQuestion.followUpPrompt) {
      responsePatch.followUpValue = currentFollowUp.trim();
    }

    const nextResponses = upsertResponse(responses, currentQuestion.id, responsePatch);
    setResponses(nextResponses);

    if (currentIndex < questions.length - 1) {
      const nextQ = questions[currentIndex + 1];
      const nextRes = nextResponses.find(r => r.questionId === nextQ.id);
      setCurrentText(nextRes?.textValue || '');
      setCurrentFollowUp(nextRes?.followUpValue || '');
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(nextResponses);
    }
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
  const isComplete = currentQuestion.type === 'choice' ? !!currentSelection : 
                     currentQuestion.type === 'text' ? currentText.trim().length > 5 :
                     !!currentSelection; // Hybrid just needs selection for next

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
            {currentIndex + 1} / {questions.length}
          </span>
          {currentIndex > 0 && (
            <button onClick={handleBack} className="text-slate-400 hover:text-indigo-600 font-semibold text-xs transition-colors">
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
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
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
            <textarea
              className="w-full h-40 p-6 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-700 font-medium resize-none"
              placeholder="Be honest. What was the signal everyone ignored?"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
            />
          )}

          {currentQuestion.type === 'hybrid' && currentSelection && (
            <div className="mt-8 animate-fadeIn">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                {currentQuestion.followUpPrompt}
              </label>
              <input
                className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-700 font-medium"
                placeholder="Optional explanation..."
                value={currentFollowUp}
                onChange={(e) => setCurrentFollowUp(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isComplete}
            className={`px-10 py-4 rounded-2xl font-bold transition-all
              ${!isComplete 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95'
              }`}
          >
            {currentIndex === questions.length - 1 ? 'Finish Gauntlet' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
