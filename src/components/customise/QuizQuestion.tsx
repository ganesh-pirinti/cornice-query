import React from 'react';
import type { QuizQuestionData, QuizOption } from '../../data/customiseQuestions';
import { CheckCircle2, Circle } from 'lucide-react';

interface QuizQuestionProps {
  questionData: QuizQuestionData;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  questionData,
  selectedOptionId,
  onSelectOption,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
        {questionData.question}
      </h3>

      <div className="space-y-3">
        {questionData.options.map((option: QuizOption) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onSelectOption(option.id)}
              className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                  : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-zinc-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center border shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-white/5 text-zinc-400 border-white/10 group-hover:border-zinc-500'
                  }`}
                >
                  {option.id}
                </span>
                <span className="text-sm font-medium leading-relaxed">{option.text}</span>
              </div>

              {isSelected ? (
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 ml-2" />
              ) : (
                <Circle className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
