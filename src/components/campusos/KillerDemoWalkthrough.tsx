import React, { useState } from 'react';
import { Award, Play, ChevronRight, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

interface KillerDemoWalkthroughProps {
  onSelectTab: (tab: 'student' | 'operations' | 'events' | 'visualizer') => void;
  onSimulateSpike: () => void;
}

export const KillerDemoWalkthrough: React.FC<KillerDemoWalkthroughProps> = ({
  onSelectTab,
  onSimulateSpike,
}) => {
  const [activeScenario, setActiveScenario] = useState<'student' | 'admin' | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const studentSteps = [
    {
      title: '1. Isolated Timetable & Room Change',
      desc: 'Normal university app: Student doesn\'t know 10:00 AM CSE204 class was moved to Block C due to B204 AC failure.',
      actionText: 'View Connected Schedule Alert',
      onClick: () => onSelectTab('student'),
    },
    {
      title: '2. Attendance Risk Threshold Shield',
      desc: 'CAMPUSOS cross-references attendance DB: CSE204 is at 74% (< 75% cutoff). Class is marked MANDATORY.',
      actionText: 'Inspect Attendance Threshold',
      onClick: () => onSelectTab('student'),
    },
    {
      title: '3. Assignment Deadline & Bus Synchronization',
      desc: 'Lab #4 due at 11:59 PM. System aligns evening class end (3:30 PM) with Bus 3 (5:30 PM departure).',
      actionText: 'Check Bus & Task Alignment',
      onClick: () => onSelectTab('student'),
    },
    {
      title: '4. Contextual Event Recommendation',
      desc: 'Detects free period (3:30 - 6:00 PM), 4 min walk to APJ Block, and interest in AI -> Nudges Qiskit Workshop.',
      actionText: 'View Event Nudge',
      onClick: () => onSelectTab('events'),
    },
  ];

  const adminSteps = [
    {
      title: '1. Fragmented Student Complaint Spike',
      desc: '20 students independently submit "AC not cooling in Room B204". Normally lost as separate tickets.',
      actionText: 'Trigger 5 New Complaints Spike',
      onClick: () => {
        onSelectTab('operations');
        onSimulateSpike();
      },
    },
    {
      title: '2. Spatial-Temporal Cluster Engine Grouping',
      desc: 'CAMPUSOS detects all 20 reports share Block B / Room B204 within 48h and groups them into 1 cluster.',
      actionText: 'Inspect Incident Cluster Ticket',
      onClick: () => onSelectTab('operations'),
    },
    {
      title: '3. Automatic Priority Escalation & Class Relocation',
      desc: 'Status upgraded to CRITICAL EMERGENCY. Auto-triggers class relocation to Block C to prevent class disruption.',
      actionText: 'View Operations Dashboard',
      onClick: () => onSelectTab('operations'),
    },
  ];

  const handleStartScenario = (scenario: 'student' | 'admin') => {
    setActiveScenario(scenario);
    setStepIndex(0);
    if (scenario === 'student') {
      onSelectTab('student');
    } else {
      onSelectTab('operations');
      onSimulateSpike();
    }
  };

  const currentSteps = activeScenario === 'student' ? studentSteps : adminSteps;

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-orange-950/40 border border-amber-500/40 backdrop-blur-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold mb-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>HACKATHON DEMO MODE — JUDGES WALKTHROUGH</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Experience the One Killer Scenario</h3>
          <p className="text-xs text-zinc-300 mt-1 max-w-xl">
            Choose a live presentation scenario to walk through how CAMPUSOS connects disconnected SRM-AP systems.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleStartScenario('student')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeScenario === 'student'
                ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            Scenario A: Student's Connected Day
          </button>

          <button
            onClick={() => handleStartScenario('admin')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeScenario === 'admin'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Scenario B: Operations Early Intervention
          </button>
        </div>
      </div>

      {/* Step Stepper Progress if active */}
      {activeScenario && (
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-amber-300">
            <span>
              STEP {stepIndex + 1} OF {currentSteps.length}: <strong>{currentSteps[stepIndex].title}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={stepIndex === 0}
                onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                className="px-2.5 py-1 rounded-lg bg-white/10 text-white disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={stepIndex === currentSteps.length - 1}
                onClick={() => {
                  const next = Math.min(currentSteps.length - 1, stepIndex + 1);
                  setStepIndex(next);
                  currentSteps[next].onClick();
                }}
                className="px-3 py-1 rounded-lg bg-orange-500 text-slate-950 font-bold disabled:opacity-30 flex items-center gap-1 cursor-pointer"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 text-xs font-mono text-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="leading-relaxed text-zinc-300 max-w-2xl">{currentSteps[stepIndex].desc}</p>
            <button
              onClick={currentSteps[stepIndex].onClick}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentSteps[stepIndex].actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
