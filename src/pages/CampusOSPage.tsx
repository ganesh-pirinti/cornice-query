import React, { useState } from 'react';
import { User, ShieldAlert, Sliders, Award, Zap } from 'lucide-react';
import { StudentCockpitView } from '../components/campusos/StudentCockpitView';
import { OperationsTriangulationView } from '../components/campusos/OperationsTriangulationView';
import { SandboxControlBar } from '../components/campusos/SandboxControlBar';

import {
  SRM_STUDENT_PROFILE,
  INITIAL_ENROLLED_COURSES,
  INITIAL_BUILDINGS,
  INITIAL_DEDUPLICATED_ISSUE,
  INITIAL_STUDENT_SCHEDULE,
  INITIAL_MOBILITY_CONFLICT,
  INITIAL_OPPORTUNITY,
} from '../data/campusosData';

import type {
  StudentScheduleItem,
  MobilityConflictItem,
  CampusOpportunityItem,
  DeduplicatedAssetIssue,
} from '../types/campusos';

export const CampusOSPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'student' | 'operations' | 'sandbox'>('student');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Dynamic Reactive State
  const [studentProfile] = useState(SRM_STUDENT_PROFILE);
  const [courses] = useState(INITIAL_ENROLLED_COURSES);
  const [buildings, setBuildings] = useState(INITIAL_BUILDINGS);
  const [scheduleItem, setScheduleItem] = useState<StudentScheduleItem>(INITIAL_STUDENT_SCHEDULE);
  const [mobilityConflict, setMobilityConflict] = useState<MobilityConflictItem>(INITIAL_MOBILITY_CONFLICT);
  const [opportunityItem, setOpportunityItem] = useState<CampusOpportunityItem>(INITIAL_OPPORTUNITY);
  const [deduplicatedIssue, setDeduplicatedIssue] = useState<DeduplicatedAssetIssue>(INITIAL_DEDUPLICATED_ISSUE);

  // Trigger A: Room Reschedule (Block A -> Block C)
  const handleTriggerRoomReschedule = () => {
    setScheduleItem((prev) => ({
      ...prev,
      room: 'C-304',
      block: 'Block C',
      originalRoom: 'A-201',
      originalBlock: 'Block A',
      isRelocated: true,
      walkTimeMins: 14,
      contextNote:
        'You need 14 mins walking time from Block A. Missing this class drops you to 71.4% and revokes hall ticket eligibility.',
    }));
  };

  // Trigger B: Fire 15 Maintenance Grievances (Raw reports surge from 12 to 27)
  const handleFireGrievances = () => {
    setDeduplicatedIssue((prev) => {
      const newPings = [...prev.rawPings];
      for (let i = 13; i <= 27; i++) {
        newPings.unshift({
          id: `p-${i}`,
          studentReg: `AP2311001${1000 + i}`,
          text: i % 2 === 0 ? 'AC compressor making extreme noise in B204' : 'AC cooling zero in B-204 Level 2',
          location: 'Block B Level 2 Room B-204',
          timestamp: 'Just now',
        });
      }
      return {
        ...prev,
        totalRawReports: prev.totalRawReports + 15,
        priority: 'CRITICAL',
        status: 'Dispatched',
        rawPings: newPings,
      };
    });

    setBuildings((prev) =>
      prev.map((b) => (b.code === 'BLK-B' ? { ...b, issueCount: 27, hasActiveIssue: true } : b))
    );
  };

  // Trigger C: Simulate Lab Overrun (Lab delayed to 5:00 PM)
  const handleSimulateLabOverrun = () => {
    setMobilityConflict((prev) => ({
      ...prev,
      labEndTime: '5:00 PM',
      missDurationMins: 12,
      holdRequested: false,
    }));
  };

  // User Actions
  const handleHoldRequest = () => {
    setMobilityConflict((prev) => ({ ...prev, holdRequested: true }));
  };

  const handleRSVP = () => {
    setOpportunityItem((prev) => ({ ...prev, rsvped: true }));
  };

  const handleDispatchMaintenance = () => {
    setDeduplicatedIssue((prev) => ({ ...prev, status: 'Dispatched' }));
  };

  const handleAutoRerouteClass = () => {
    setDeduplicatedIssue((prev) => ({ ...prev, status: 'Rerouted' }));
  };

  const handleBroadcastUpdate = () => {
    // Notification broadcasted
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#070709] text-zinc-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Brand & Theme Lockup */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#002147] via-[#0b1c38] to-[#070709] border border-blue-500/30 p-8 sm:p-12 text-white shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold tracking-wider uppercase">
              <Award className="w-4 h-4 text-amber-400" />
              <span>SRM UNIVERSITY-AP • PS02 PROTOTYPE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              CAMPUS<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">OS</span>
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 font-sans leading-relaxed">
              The Connected Campus Intelligence System for SRM University-AP. Connecting Academia ERP, attendance thresholds, spatial GIS navigation, mobility transit, and facility maintenance into one decision layer.
            </p>
          </div>

          {/* Quick Pitch Badge */}
          <div className="p-5 rounded-2xl bg-black/60 border border-white/15 text-xs font-mono text-amber-200 leading-relaxed max-w-xs w-full shrink-0 shadow-lg">
            <div className="text-[10px] text-zinc-400 uppercase font-bold mb-1">ONE-LINE PITCH</div>
            "CAMPUSOS doesn't replace SRM's existing software — it connects them into one intelligent layer that turns scattered data into timely actions."
          </div>
        </div>
      </div>

      {/* Main Layout Navigation Bar */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 p-2 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl">
        <button
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'student'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" />
          <span>View 1: Student Intelligence Cockpit</span>
        </button>

        <button
          onClick={() => setActiveTab('operations')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'operations'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>View 2: Campus Operations & Admin Triangulation</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sandbox'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>View 3: Interactive Simulation Sandbox</span>
        </button>
      </div>

      {/* View Content Renderer */}
      {activeTab === 'student' && (
        <StudentCockpitView
          profile={studentProfile}
          courses={courses}
          scheduleItem={scheduleItem}
          mobilityConflict={mobilityConflict}
          opportunityItem={opportunityItem}
          onHoldRequest={handleHoldRequest}
          onRSVP={handleRSVP}
        />
      )}

      {activeTab === 'operations' && (
        <OperationsTriangulationView
          buildings={buildings}
          deduplicatedIssue={deduplicatedIssue}
          onDispatchMaintenance={handleDispatchMaintenance}
          onAutoRerouteClass={handleAutoRerouteClass}
          onBroadcastUpdate={handleBroadcastUpdate}
        />
      )}

      {activeTab === 'sandbox' && (
        <div className="p-8 rounded-3xl bg-zinc-900/90 border border-white/10 text-white space-y-6 animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-bold">
            <Zap className="w-5 h-5" />
            <span>Interactive Simulation Sandbox Guide</span>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed font-mono">
            Click any of the sticky trigger buttons at the bottom of the screen to simulate live data stream changes across SRM-AP's connected context engine.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <h4 className="text-sm font-bold text-amber-300 font-mono">Button A: Trigger Room Reschedule</h4>
              <p className="text-xs text-zinc-300 font-mono">
                Changes 10:00 AM class from Block A to Block C. Watch Student View re-calculate 14 min walk time & attendance risk alert.
              </p>
              <button
                onClick={handleTriggerRoomReschedule}
                className="w-full py-2 rounded-xl bg-amber-500 text-slate-950 font-mono font-bold text-xs mt-2"
              >
                Execute Trigger A
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-2">
              <h4 className="text-sm font-bold text-red-300 font-mono">Button B: Fire 15 Maintenance Grievances</h4>
              <p className="text-xs text-zinc-300 font-mono">
                Simulates 15 raw student pings hitting server. Watch Operations View instantly deduplicate them from 12 to 27 pings into 1 master maintenance order.
              </p>
              <button
                onClick={handleFireGrievances}
                className="w-full py-2 rounded-xl bg-red-600 text-white font-mono font-bold text-xs mt-2"
              >
                Execute Trigger B
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2">
              <h4 className="text-sm font-bold text-blue-300 font-mono">Button C: Simulate Lab Overrun</h4>
              <p className="text-xs text-zinc-300 font-mono">
                Delays lab to 5:00 PM. Watch mobility layer alert student about missing Bus #4 by 12 mins and offer 10-min bus hold / late shuttle request.
              </p>
              <button
                onClick={handleSimulateLabOverrun}
                className="w-full py-2 rounded-xl bg-blue-600 text-white font-mono font-bold text-xs mt-2"
              >
                Execute Trigger C
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Control Bar */}
      <SandboxControlBar
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onTriggerRoomReschedule={handleTriggerRoomReschedule}
        onFireGrievances={handleFireGrievances}
        onSimulateLabOverrun={handleSimulateLabOverrun}
        onSelectTab={setActiveTab}
      />
    </div>
  );
};
