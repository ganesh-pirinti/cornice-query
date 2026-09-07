import React from 'react';
import { CustomiseHero } from '../components/customise/CustomiseHero';
import { QualificationQuiz } from '../components/customise/QualificationQuiz';
import { WhatHappensNext } from '../components/customise/WhatHappensNext';
import { useSetDocumentTitle } from '../utils/seo';

export const CustomisePage: React.FC = () => {
  useSetDocumentTitle({
    title: 'Cornice & Query — Customise Your Build',
    description: 'Have a custom web project idea? Complete our quick 5-question qualification to connect with Cornice & Query for custom website development.',
  });

  const handleStartQuiz = () => {
    const quizElement = document.getElementById('qualification-quiz');
    if (quizElement) {
      quizElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pt-24 sm:pt-28 pb-20 space-y-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Service Hero Banner & Top Journey Card */}
        <CustomiseHero onStartQuiz={handleStartQuiz} />

        {/* Qualification Quiz Section */}
        <div id="qualification-quiz" className="pt-2">
          <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              PROJECT QUALIFICATION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Quick Intent Qualification
            </h2>
            <p className="text-xs text-zinc-400">
              Answer 5 simple questions about your build idea to unlock direct WhatsApp connection with our team.
            </p>
          </div>

          <QualificationQuiz />
        </div>

        {/* WHAT HAPPENS NEXT — Build Process Direction */}
        <WhatHappensNext />
      </div>
    </div>
  );
};
