import React, { useState } from 'react';
import {
  AlertTriangle,
  MapPin,
  Clock,
  Bus,
  Sparkles,
  CheckCircle2,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sliders,
  X
} from 'lucide-react';

import type {
  StudentProfile,
  EnrolledCourse,
  StudentScheduleItem,
  MobilityConflictItem,
  CampusOpportunityItem,
} from '../../types/campusos';

interface StudentCockpitViewProps {
  profile: StudentProfile;
  courses: EnrolledCourse[];
  scheduleItem: StudentScheduleItem;
  mobilityConflict: MobilityConflictItem;
  opportunityItem: CampusOpportunityItem;
  onHoldRequest: () => void;
  onRSVP: () => void;
}

export const StudentCockpitView: React.FC<StudentCockpitViewProps> = ({
  profile,
  courses,
  scheduleItem,
  mobilityConflict,
  opportunityItem,
  onHoldRequest,
  onRSVP,
}) => {
  const [missedClassesCount, setMissedClassesCount] = useState<number>(1);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);

  // Calculate live forecasted attendance for CSE204 based on slider
  const cse204Course = courses.find((c) => c.code === 'CSE204') || courses[0];
  const currentAttended = cse204Course.attended;
  const currentTotal = cse204Course.total;

  const forecastedTotal = currentTotal + missedClassesCount;
  const forecastedPercentage = Number(((currentAttended / forecastedTotal) * 100).toFixed(1));

  // Required consecutive lectures to reach 75%
  let requiredConsecutive = 0;
  let tempAttended = currentAttended;
  let tempTotal = forecastedTotal;
  while (tempAttended / tempTotal < 0.75 && requiredConsecutive < 20) {
    tempAttended++;
    tempTotal++;
    requiredConsecutive++;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Student Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#002147] via-[#091e3a] to-[#0f172a] border border-blue-500/30 text-white shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 border-2 border-white/20 flex items-center justify-center font-mono font-black text-2xl shadow-lg shadow-blue-500/30 shrink-0">
              RS
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{profile.name}</h1>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  {profile.regNo}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200/90 font-medium">{profile.program}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3 shrink-0 font-mono text-xs">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">STATUS & COMMUTE</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span>{profile.status}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-amber-300">{profile.busRoute}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Feed & Forecaster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: What Matters Today Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span>What Matters Today</span>
              <span className="text-xs font-mono text-zinc-400 font-normal">(Chronological & Context-Aware)</span>
            </h2>
            <span className="text-[11px] font-mono text-emerald-500 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              LIVE SRMAP SYNC
            </span>
          </div>

          {/* Card 1: Critical Attendance Alert */}
          <div
            className={`p-6 rounded-3xl border transition-all duration-300 backdrop-blur-xl relative ${
              scheduleItem.isRelocated
                ? 'bg-gradient-to-r from-red-950/40 via-zinc-900 to-amber-950/30 border-red-500/50 shadow-xl shadow-red-950/30 ring-1 ring-red-500/40'
                : 'bg-red-950/20 border-red-500/40'
            }`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/50 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  CRITICAL ATTENDANCE ALERT
                </span>
                {scheduleItem.isRelocated && (
                  <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1 animate-pulse">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    VENUE RESCHEDULED
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {scheduleItem.time}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-white">{scheduleItem.subject}</h3>
                <p className="text-xs font-mono text-zinc-400 mt-1">Instructor: {scheduleItem.instructor}</p>
              </div>

              {/* Attendance Pill */}
              <div className="p-3 rounded-2xl bg-black/50 border border-red-500/40 text-right shrink-0">
                <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold">CURRENT ATTENDANCE</div>
                <div className="text-2xl font-mono font-black text-red-400 flex items-center justify-end gap-1">
                  {scheduleItem.attendancePercentage}%
                  <span className="text-[10px] font-mono font-bold text-red-300 bg-red-500/30 px-1.5 py-0.5 rounded border border-red-500/50">
                    &lt; 75% CUTOFF
                  </span>
                </div>
              </div>
            </div>

            {/* Venue Shift Info */}
            <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Classroom Location:</span>
                {scheduleItem.isRelocated ? (
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <span className="line-through text-zinc-500">{scheduleItem.originalBlock} ({scheduleItem.originalRoom})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                    <strong className="text-white bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                      {scheduleItem.block} ({scheduleItem.room})
                    </strong>
                  </span>
                ) : (
                  <span className="text-white font-bold">{scheduleItem.block} ({scheduleItem.room})</span>
                )}
              </div>

              <p className="text-xs text-red-200/90 font-mono leading-relaxed pt-1">
                💡 <strong>Context Note:</strong> {scheduleItem.contextNote}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                Est. Walk Time: <strong>{scheduleItem.walkTimeMins || 14} mins</strong>
              </span>

              <button
                onClick={() => setShowMapModal(true)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs transition-all shadow-md shadow-red-600/30 cursor-pointer flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View Walking Route</span>
              </button>
            </div>
          </div>

          {/* Card 2: Lab Deadline + Mobility Conflict */}
          <div className="p-6 rounded-3xl bg-zinc-900/80 border border-amber-500/40 text-white backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center gap-1">
                <Bus className="w-3.5 h-3.5 text-amber-400" />
                MOBILITY & TIMELINE CONFLICT DETECTED
              </span>
              <span className="text-xs font-mono text-zinc-400">Due {mobilityConflict.labEndTime}</span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">{mobilityConflict.labTitle}</h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Usual Departure: <strong>{mobilityConflict.busRoute}</strong> departs at{' '}
                <strong className="text-amber-300">{mobilityConflict.busDepartureTime}</strong> from{' '}
                {mobilityConflict.departureGate}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs font-mono text-amber-200/90 leading-relaxed">
              💡 <strong>CAMPUSOS Context Note:</strong> Lab running until {mobilityConflict.labEndTime}. Walking time to Admin Gate is {mobilityConflict.walkTimeMins} mins. You will miss {mobilityConflict.busRoute.split(' ')[0]} by <strong>{mobilityConflict.missDurationMins} minutes</strong>.
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Transit Action Status:</span>
              <button
                onClick={onHoldRequest}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  mobilityConflict.holdRequested
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:scale-105 shadow-md shadow-amber-500/20'
                }`}
              >
                {mobilityConflict.holdRequested ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>10-Min Bus Hold Confirmed!</span>
                  </>
                ) : (
                  <>
                    <Bus className="w-4 h-4" />
                    <span>Request 10-Min Bus Hold / Book Late Shuttle</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 3: Opportunity Match */}
          <div className="p-6 rounded-3xl bg-zinc-900/80 border border-blue-500/40 text-white backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/50 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                CONTEXTUAL OPPORTUNITY MATCH
              </span>
              <span className="text-xs font-mono text-blue-300 font-bold">{opportunityItem.time}</span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">{opportunityItem.title}</h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Venue: <strong className="text-white">{opportunityItem.location}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-xs font-mono text-blue-200/90 leading-relaxed">
              💡 <strong>CAMPUSOS Context Note:</strong> Matches your <strong>{opportunityItem.matchingElective}</strong>. You have an unallocated free period gap between <strong>{opportunityItem.freeWindow}</strong>.
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Elective Alignment: 100%</span>
              <button
                onClick={onRSVP}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                  opportunityItem.rsvped
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                }`}
              >
                {opportunityItem.rsvped ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>RSVP Confirmed & Synced</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>One-Click RSVP</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Prescriptive Attendance Forecaster */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-white/10 text-white backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  Prescriptive Attendance Forecaster
                </h3>
                <span className="text-[11px] font-mono text-zinc-400">SRM-AP Academia ERP Simulator</span>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            {/* Enrolled Courses List with Progress Rings */}
            <div className="space-y-4">
              {courses.map((course) => {
                const pct = Number(((course.attended / course.total) * 100).toFixed(1));
                const isCritical = pct < course.targetPercentage;
                return (
                  <div key={course.code} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-blue-400 mr-2">{course.code}</span>
                        <span className="font-semibold text-white">{course.name}</span>
                      </div>
                      <span
                        className={`font-mono font-extrabold text-sm ${
                          isCritical ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical ? 'bg-red-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>Attended: {course.attended}/{course.total} lectures</span>
                      <span>Target: {course.targetPercentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Slider Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-blue-950/40 to-slate-900 border border-blue-500/30 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-300 font-bold">Interactive Skip Simulator:</span>
                <span className="text-amber-300 font-extrabold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  {missedClassesCount === 0 ? 'No Absences' : `Miss Today +${missedClassesCount - 1} lectures`}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-2">
                  "What if I miss today's CSE204 Operating Systems?"
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={missedClassesCount}
                  onChange={(e) => setMissedClassesCount(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>Present (0)</span>
                  <span>Miss Today (1)</span>
                  <span>Miss 5 Lectures</span>
                </div>
              </div>

              {/* Dynamic Live Recalculation Output */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Recalculated CSE204 Attendance:</span>
                  <span
                    className={`font-black text-sm ${
                      forecastedPercentage < 75 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {forecastedPercentage}%
                  </span>
                </div>

                <div className="pt-2 border-t border-white/10 text-[11px] leading-relaxed">
                  {forecastedPercentage < 75 ? (
                    <span className="text-red-300">
                      ⚠️ <strong>Hall Ticket Risk:</strong> You must attend{' '}
                      <strong className="text-white underline">{requiredConsecutive} consecutive lectures</strong>{' '}
                      without missing to restore your attendance back to &ge;75%!
                    </span>
                  ) : (
                    <span className="text-emerald-300">
                      ✅ <strong>Safe Attendance:</strong> You remain above the mandatory 75% threshold.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Walking Route Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0e0e14] border border-white/20 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold">
              <Compass className="w-4 h-4" />
              <span>SRM-AP GIS SPATIAL ROUTE MAPPER</span>
            </div>

            <h3 className="text-xl font-extrabold text-white">Walking Route: Block A → Block C</h3>

            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 space-y-3">
              <div className="flex items-center justify-between text-blue-300 font-bold border-b border-white/10 pb-2">
                <span>Distance: 850 meters</span>
                <span>Est. Time: 14 mins</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                <li>Exit Block A Main Entrance towards Central Quadrangle (2 mins).</li>
                <li>Pass by APJ Abdul Kalam Block North Corridor (5 mins).</li>
                <li>Cross ALC Complex walkway towards Academic Block C (4 mins).</li>
                <li>Take Elevator / Stairs to Level 3, Room C-304 (3 mins).</li>
              </ol>
            </div>

            <button
              onClick={() => setShowMapModal(false)}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs"
            >
              Close Route Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
