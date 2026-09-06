import React from 'react';

interface QuizProgressProps {
  currentQuestion: number; // 1-indexed
  totalQuestions: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentQuestion,
  totalQuestions,
}) => {
  const percentage = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-amber-400 font-bold uppercase tracking-widest">
          QUESTION {currentQuestion} OF {totalQuestions}
        </span>
        <span className="text-zinc-400 font-semibold">{percentage}% COMPLETED</span>
      </div>

      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
