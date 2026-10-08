import React from 'react';
import { Play, Flame, Bus, Sun, Moon, Award } from 'lucide-react';

interface SandboxControlBarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onTriggerRoomReschedule: () => void;
  onFireGrievances: () => void;
  onSimulateLabOverrun: () => void;
  onSelectTab: (tab: 'student' | 'operations' | 'sandbox') => void;
}

export const SandboxControlBar: React.FC<SandboxControlBarProps> = ({
  isDarkMode,
  onToggleTheme,
  onTriggerRoomReschedule,
  onFireGrievances,
  onSimulateLabOverrun,
  onSelectTab,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#070709]/95 backdrop-blur-2xl border-t border-blue-500/30 px-4 py-3 shadow-2xl shadow-black">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left Info Label */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">LIVE HACKATHON SIMULATION SANDBOX</span>
            <span className="md:hidden">SANDBOX</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            title="Toggle Dark / Light Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            <span className="hidden lg:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        {/* Center: 3 Trigger Buttons for Hackathon Presentation */}
        <div className="flex items-center gap-2 flex-wrap justify-center w-full sm:w-auto">
          {/* Button A */}
          <button
            onClick={() => {
              onSelectTab('student');
              onTriggerRoomReschedule();
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 hover:text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/10 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 text-amber-400" />
            <span>Button A: "Trigger Room Reschedule"</span>
          </button>

          {/* Button B */}
          <button
            onClick={() => {
              onSelectTab('operations');
              onFireGrievances();
            }}
            className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 hover:text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-red-500/10 active:scale-95"
          >
            <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Button B: "Fire 15 Maintenance Grievances"</span>
          </button>

          {/* Button C */}
          <button
            onClick={() => {
              onSelectTab('student');
              onSimulateLabOverrun();
            }}
            className="px-3.5 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-300 hover:text-white font-mono font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-500/10 active:scale-95"
          >
            <Bus className="w-3.5 h-3.5 text-blue-400" />
            <span>Button C: "Simulate Lab Overrun"</span>
          </button>
        </div>
      </div>
    </div>
  );
};
