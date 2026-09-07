import React, { useState } from 'react';
import { CUSTOMISE_QUESTIONS } from '../../data/customiseQuestions';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { FullStackQuestion } from './FullStackQuestion';
import { QualificationResult } from './QualificationResult';
import { PricingModal } from './PricingModal';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { trackEvent } from '../../services/analyticsService';

export const QualificationQuiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [fullStackChoice, setFullStackChoice] = useState<'YES' | 'NO' | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  const totalQuestions = CUSTOMISE_QUESTIONS.length;
  const currentQuestion = CUSTOMISE_QUESTIONS[currentIndex];
  const selectedOptionId = answers[currentQuestion?.id] || null;

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (!selectedOptionId) return;

    if (currentIndex === 0) {
      trackEvent('quiz_started');
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      trackEvent('quiz_completed');
      setQuizFinished(true);

      const computedScore = CUSTOMISE_QUESTIONS.reduce((acc, q) => {
        return answers[q.id] === q.correctAnswer ? acc + 1 : acc;
      }, 0);

      if (computedScore >= 3) {
        trackEvent('qualification_passed', { score: computedScore });
      } else {
        trackEvent('qualification_failed', { score: computedScore });
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTryAgain = () => {
    setAnswers({});
    setCurrentIndex(0);
    setQuizFinished(false);
    setFullStackChoice(null);
    setShowPricing(false);
  };

  const handleFullStackChoice = (choice: 'YES' | 'NO') => {
    setFullStackChoice(choice);
    if (choice === 'YES') {
      trackEvent('fullstack_yes');
    } else {
      trackEvent('fullstack_no');
    }
    setShowPricing(true);
  };

  // Compute score
  const score = CUSTOMISE_QUESTIONS.reduce((acc, q) => {
    return answers[q.id] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  // 1. If score < 3: Render Fail Result (Not Qualified)
  if (quizFinished && score < 3) {
    return (
      <QualificationResult
        score={score}
        totalQuestions={totalQuestions}
        onTryAgain={handleTryAgain}
        resultType="FAIL"
      />
    );
  }

  // 2. If score >= 3 AND FullStackChoice not chosen yet: Render FullStackQuestion
  if (quizFinished && score >= 3 && !fullStackChoice) {
    return (
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 animate-fadeIn" id="qualification-quiz">
        <FullStackQuestion
          selectedChoice={fullStackChoice}
          onSelectChoice={handleFullStackChoice}
        />
      </div>
    );
  }

  // 3. If score >= 3 AND FullStackChoice chosen: Render Qualified Result (PricingModal with WhatsApp Channel CTA)
  if (quizFinished && score >= 3 && fullStackChoice && showPricing) {
    return <PricingModal score={score} fullStackChoice={fullStackChoice} />;
  }

  // 5. Active Quiz Question View
  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 animate-fadeIn" id="qualification-quiz">
      {/* Quiz Progress Bar */}
      <QuizProgress currentQuestion={currentIndex + 1} totalQuestions={totalQuestions} />

      {/* Current Question */}
      <QuizQuestion
        questionData={currentQuestion}
        selectedOptionId={selectedOptionId}
        onSelectOption={handleSelectOption}
      />

      {/* Footer Controls */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
        {currentIndex > 0 ? (
          <button
            onClick={handlePrevious}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>PREVIOUS</span>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleNext}
          disabled={!selectedOptionId}
          style={
            !selectedOptionId
              ? {
                  backgroundColor: 'rgba(35, 30, 25, 0.9)',
                  border: '1px solid rgba(220, 150, 50, 0.55)',
                }
              : undefined
          }
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 opacity-100 z-10 relative ${
            selectedOptionId
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 cursor-pointer'
              : 'text-[#f5f0eb] cursor-not-allowed'
          }`}
        >
          <span>{currentIndex === totalQuestions - 1 ? 'CONTINUE TO QUALIFICATION' : 'NEXT QUESTION'}</span>
          <ArrowRight className={`w-4 h-4 shrink-0 ${selectedOptionId ? 'text-slate-950' : 'text-amber-400'}`} />
        </button>
      </div>
    </div>
  );
};
