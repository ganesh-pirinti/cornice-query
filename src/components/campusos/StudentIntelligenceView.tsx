import React from 'react';
import { Clock, MapPin, AlertTriangle, CheckCircle2, Bus, Calendar, FileText, ArrowRight, Sparkles } from 'lucide-react';
import type { StudentScheduleItem, AssignmentItem, CampusEventItem, BusScheduleItem, ContextNudge } from '../../types/campusos';

interface StudentIntelligenceViewProps {
  schedule: StudentScheduleItem[];
  assignments: AssignmentItem[];
  events: CampusEventItem[];
  buses: BusScheduleItem[];
  nudges: ContextNudge[];
}

export const StudentIntelligenceView: React.FC<StudentIntelligenceViewProps> = ({
  schedule,
  assignments,
  events,
  buses,
  nudges,
}) => {
  return (
    <div className="space-[#0e0e14] space-y-6">
      {/* Dynamic Summary Banner: What Matters Today */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-950/60 via-amber-950/40 to-zinc-900 border border-orange-500/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-mono font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STUDENT INTELLIGENCE LAYER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              What Matters Today?
            </h2>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              CAMPUSOS contextually connects your timetables, attendance thresholds, deadlines, room relocations, and bus departures into a single actionable timeline.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-3 shrink-0">
            <div className="text-right">
              <div className="text-xs font-mono text-zinc-400">SRM-AP STATUS</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                5 Systems Connected
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Critical Nudges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {nudges.slice(0, 3).map((nudge) => (
            <div
              key={nudge.id}
              className={`p-4 rounded-2xl border transition-all ${
                nudge.severity === 'critical'
                  ? 'bg-red-950/30 border-red-500/40 text-red-200'
                  : nudge.severity === 'warning'
                  ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  : 'bg-blue-950/30 border-blue-500/40 text-blue-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded bg-black/40 border border-current">
                  {nudge.badge}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">{nudge.time}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                {nudge.severity === 'critical' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
                {nudge.title}
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{nudge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Connected Schedule & Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Today's Connected Timetable */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              Connected Class Schedule
            </h3>
            <span className="text-xs font-mono text-zinc-400">SRM-AP Fall Semester</span>
          </div>

          <div className="space-y-4">
            {schedule.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border backdrop-blur-xl transition-all ${
                  item.isRelocated
                    ? 'bg-amber-950/15 border-amber-500/40 hover:border-amber-500/70 shadow-lg shadow-amber-950/20'
                    : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300">
                        {item.code}
                      </span>
                      <span className="text-sm font-extrabold text-white">{item.subject}</span>
                      {item.isRelocated && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          VENUE CHANGED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-400" />
                        {item.time}
                      </span>
                      <span>• {item.instructor}</span>
                    </div>
                  </div>

                  {/* Attendance Risk Meter */}
                  <div className="text-right shrink-0 bg-black/40 border border-white/10 rounded-xl p-3">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase">SUBJECT ATTENDANCE</div>
                    <div className="flex items-center gap-2 mt-0.5 justify-end">
                      <span
                        className={`text-lg font-mono font-black ${
                          item.attendanceStatus === 'critical'
                            ? 'text-red-400'
                            : item.attendanceStatus === 'warning'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {item.attendancePercentage}%
                      </span>
                      {item.attendanceStatus === 'critical' ? (
                        <span className="text-[10px] font-mono font-bold text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/50">
                          ATTENDANCE REQUIRED
                        </span>
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Spatial Context Bar */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>
                      Current Venue: <strong className="text-white font-mono">{item.room} ({item.block})</strong>
                    </span>
                    {item.isRelocated && (
                      <span className="text-zinc-400 font-mono line-through">was {item.originalRoom}</span>
                    )}
                  </div>

                  {item.walkTimeMins && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 font-mono text-[11px] font-bold">
                      <ArrowRight className="w-3 h-3" />
                      <span>{item.walkTimeMins} mins walk time from your location</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Connected Event Nudge Highlight */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30 border border-blue-500/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  SMART CONTEXTUAL EVENT RECOMMENDATION
                </span>
                <h4 className="text-base font-bold text-white mt-2">
                  {events[0].title}
                </h4>
                <p className="text-xs text-zinc-300 mt-1">
                  {events[0].reasonText}
                </p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-mono font-bold text-xs shrink-0 cursor-pointer shadow-lg shadow-blue-500/20 transition-all">
                Register Free
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Submissions & Mobility Layer */}
        <div className="space-y-6">
          {/* Assignments & Submissions */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Pending Submissions
            </h3>

            <div className="space-y-3">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    asg.urgency === 'critical'
                      ? 'bg-red-950/20 border-red-500/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-zinc-400">{asg.subject}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        asg.urgency === 'critical'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {asg.dueTime}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1.5">{asg.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Transport / Mobility Sync */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bus className="w-4 h-4 text-orange-400" />
              Mobility & Bus Sync
            </h3>

            <div className="space-y-3">
              {buses.map((bus) => (
                <div key={bus.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-extrabold text-orange-400">{bus.routeNumber}</span>
                      <span className="text-xs text-white font-semibold">{bus.destination}</span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 mt-1">
                      Departure: <strong className="text-white">{bus.departureTime}</strong> ({bus.platform})
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-1 rounded-lg">
                    {bus.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-500/30 text-[11px] text-orange-200 font-mono leading-relaxed">
              💡 <strong>CAMPUSOS Mobility Insight:</strong> Your evening class ends at 03:30 PM and workshop ends at 06:00 PM. Bus 3 (5:30 PM) matches your class exit schedule seamlessly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
