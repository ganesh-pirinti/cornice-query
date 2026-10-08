import React, { useState } from 'react';
import {
  ShieldAlert,
  Layers,
  Wrench,
  Radio,
  Bell,
  MapPin,
  Zap,
  CheckCircle2,
  Building,
  RefreshCw
} from 'lucide-react';

import type { BuildingNode, DeduplicatedAssetIssue } from '../../types/campusos';

interface OperationsTriangulationViewProps {
  buildings: BuildingNode[];
  deduplicatedIssue: DeduplicatedAssetIssue;
  onDispatchMaintenance: () => void;
  onAutoRerouteClass: () => void;
  onBroadcastUpdate: () => void;
}

export const OperationsTriangulationView: React.FC<OperationsTriangulationViewProps> = ({
  buildings,
  deduplicatedIssue,
  onDispatchMaintenance,
  onAutoRerouteClass,
  onBroadcastUpdate,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingNode>(
    buildings.find((b) => b.hasActiveIssue) || buildings[2]
  );
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleAction = (type: 'dispatch' | 'reroute' | 'broadcast') => {
    if (type === 'dispatch') {
      onDispatchMaintenance();
      setActionNotice('⚡ Facilities Team Alpha Dispatched! Emergency Ticket #HVAC-B2-04 activated.');
    } else if (type === 'reroute') {
      onAutoRerouteClass();
      setActionNotice('🔁 Lecture CSE301 automatically rerouted to ALC-102! Academic timetable updated.');
    } else if (type === 'broadcast') {
      onBroadcastUpdate();
      setActionNotice('📢 Push Broadcast sent to 65 enrolled students of CSE301 regarding venue update.');
    }

    setTimeout(() => setActionNotice(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Operations & Triangulation Command Center */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950/50 via-[#0a0f1d] to-zinc-900 border border-red-500/30 text-white backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>CAMPUS OPERATIONS & ADMIN TRIANGULATION ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spatial Incident Heatmap & Problem Deduplication
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
              CAMPUSOS correlates scattered student pings using spatial proximity and NLP heuristics to aggregate multiple raw reports into 1 single root cause asset ticket.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-4 shrink-0 font-mono text-xs">
            <div className="text-right">
              <div className="text-[10px] text-zinc-400 uppercase font-bold">DEDUPLICATION RATIO</div>
              <div className="text-xl font-black text-amber-400">
                {deduplicatedIssue.totalRawReports} Pings &rarr; 1 Ticket
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-zinc-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Section 1: Live Spatial Incident Heatmap */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 text-white backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-bold text-white">Live Spatial Incident Heatmap (SRM-AP Campus Map)</h2>
          </div>
          <span className="text-[10px] font-mono text-red-400 bg-red-950/60 border border-red-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            1 ACTIVE CRITICAL CLUSTER
          </span>
        </div>

        {/* Building Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {buildings.map((bld) => {
            const isSelected = selectedBuilding.id === bld.id;
            return (
              <div
                key={bld.id}
                onClick={() => setSelectedBuilding(bld)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                  bld.hasActiveIssue
                    ? 'bg-red-950/30 border-red-500/70 shadow-lg shadow-red-950/40 ring-2 ring-red-500/60 animate-pulse'
                    : isSelected
                    ? 'bg-blue-950/30 border-blue-500/70 ring-1 ring-blue-500/50'
                    : 'bg-black/40 border-white/10 hover:border-white/20'
                }`}
              >
                {bld.hasActiveIssue && (
                  <div className="absolute top-2 right-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
                  </div>
                )}

                <div className="text-[10px] font-mono text-zinc-400 uppercase font-bold">{bld.code}</div>
                <div className="text-xs font-bold text-white mt-1 line-clamp-1">{bld.name}</div>

                <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{bld.type}</span>
                  {bld.hasActiveIssue ? (
                    <span className="text-red-400 font-extrabold">{bld.issueCount} pings</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">Normal</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Issue Clustering Engine (3-Column Triangulation Demo) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Issue Clustering Engine (Triangulation Matrix)
          </h2>
          <span className="text-xs font-mono text-zinc-400">Real-time NLP Deduplication</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Raw Student Pings List */}
          <div className="p-5 rounded-3xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Radio className="w-4 h-4" />
                Raw Incoming Student Pings ({deduplicatedIssue.rawPings.length})
              </span>
              <span className="text-[10px] font-mono text-zinc-400">45 Min Window</span>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {deduplicatedIssue.rawPings.map((ping) => (
                <div
                  key={ping.id}
                  className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-zinc-300 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="text-blue-400 font-bold">{ping.studentReg}</span>
                    <span>{ping.timestamp}</span>
                  </div>
                  <p className="text-white font-semibold text-xs font-sans">"{ping.text}"</p>
                  <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-orange-400" />
                    <span>{ping.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: CAMPUSOS Deduction Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-950/30 via-zinc-900 to-black border border-amber-500/50 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
              <span className="text-xs font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                CAMPUSOS Spatial Heuristic Deduction
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
                DEDUPLICATED
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 text-xs font-mono leading-relaxed space-y-3">
              <div className="text-amber-300 font-bold border-b border-white/10 pb-2">
                "Heuristic: {deduplicatedIssue.totalRawReports} raw reports collapsed into 1 Root Cause."
              </div>

              <div className="space-y-1.5 text-zinc-200">
                <div>
                  Asset: <strong className="text-white">{deduplicatedIssue.assetId}</strong> ({deduplicatedIssue.assetName})
                </div>
                <div>
                  First Report: <strong className="text-white">{deduplicatedIssue.firstReported}</strong>
                </div>
                <div>
                  Priority: <strong className="text-red-400 font-bold">{deduplicatedIssue.priority}</strong>
                </div>
                <div>
                  Affected Lecture:{' '}
                  <strong className="text-amber-300">
                    {deduplicatedIssue.affectedLecture} ({deduplicatedIssue.affectedStudentsCount} students in 30 mins)
                  </strong>
                </div>
                <div>
                  Assigned Team: <strong className="text-blue-300">{deduplicatedIssue.assignedTeam}</strong>
                </div>
                <div>
                  Current Status:{' '}
                  <strong className="text-emerald-400 uppercase font-bold">{deduplicatedIssue.status}</strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-[11px] font-mono text-blue-200 leading-relaxed">
              💡 <strong>System Intelligence Note:</strong> Multiple isolated complaints about "dripping", "hot room", and "remote missing" in B-204 originate from Compressor Unit 2 on Block B Level 2.
            </div>
          </div>

          {/* Column 3: One-Click Operational Actions */}
          <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-orange-400" />
                Operational Actions
              </span>
              <span className="text-[10px] font-mono text-zinc-400">1-Tap Dispatch</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleAction('dispatch')}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-extrabold text-xs flex items-center justify-between shadow-lg shadow-red-600/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-white" />
                  <span>[Dispatch Maintenance]</span>
                </div>
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded">Team Alpha</span>
              </button>

              <button
                onClick={() => handleAction('reroute')}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono font-extrabold text-xs flex items-center justify-between shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-white" />
                  <span>[Auto-reroute Next Class to Empty ALC-102]</span>
                </div>
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded">ALC-102</span>
              </button>

              <button
                onClick={() => handleAction('broadcast')}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-extrabold text-xs flex items-center justify-between shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-white" />
                  <span>[Broadcast Update to Enrolled Students]</span>
                </div>
                <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded">65 Students</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-[11px] font-mono text-zinc-400 space-y-1">
              <div className="text-white font-bold mb-1">AUDIT LOG:</div>
              <div>• Ticket #HVAC-B2-04 logged.</div>
              <div>• Classroom ALC-102 availability verified.</div>
              <div>• Push notifications queued for Academia mobile app.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
