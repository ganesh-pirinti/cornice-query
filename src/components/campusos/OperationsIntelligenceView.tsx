import React, { useState } from 'react';
import { ShieldAlert, Plus, Zap, Clock, MapPin, Wrench, AlertTriangle, Layers } from 'lucide-react';
import type { ComplaintCluster, ComplaintReport } from '../../types/campusos';

interface OperationsIntelligenceViewProps {
  clusters: ComplaintCluster[];
  onAddComplaint: (block: string, room: string, issueType: string) => void;
  onSimulateSpike: () => void;
}

export const OperationsIntelligenceView: React.FC<OperationsIntelligenceViewProps> = ({
  clusters,
  onAddComplaint,
  onSimulateSpike,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<ComplaintCluster | null>(clusters[0] || null);
  const [customRoom, setCustomRoom] = useState('Room B204');
  const [customBlock, setCustomBlock] = useState('Block B');
  const [customIssue, setCustomIssue] = useState('AC not working / High temp');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComplaint(customBlock, customRoom, customIssue);
  };

  const currentCluster = clusters.find((c) => c.id === selectedCluster?.id) || clusters[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Campus Operations Intelligence */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/60 via-amber-950/30 to-zinc-900 border border-red-500/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>CAMPUS OPERATIONS INTELLIGENCE LAYER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Spatial-Temporal Issue Cluster Engine
            </h2>
            <p className="text-zinc-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Instead of treating 20 student reports of "AC not working" as 20 independent complaints, CAMPUSOS detects spatial proximity and aggregates them into high-priority operational tickets.
            </p>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onSimulateSpike}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer animate-pulse"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>SIMULATE 5 STUDENT COMPLAINTS (B204 AC)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Clusters & Live Complaints Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Cluster Ticket Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-400" />
              Active Incident Clusters ({clusters.length})
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              AUTO-AGREEMENT ACTIVE
            </span>
          </div>

          <div className="space-y-3">
            {clusters.map((cluster) => {
              const isSelected = currentCluster?.id === cluster.id;
              return (
                <div
                  key={cluster.id}
                  onClick={() => setSelectedCluster(cluster)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-red-950/30 border-red-500/70 shadow-lg shadow-red-950/40 ring-1 ring-red-500/50'
                      : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded uppercase ${
                        cluster.priority === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {cluster.priority} PRIORITY
                    </span>
                    <span className="text-xs font-mono font-extrabold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-lg">
                      🔥 {cluster.reportCount} Reports Clustered
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">{cluster.issueType}</h4>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>{cluster.block} — {cluster.room}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>First: {cluster.firstReported}</span>
                    <span className="text-white font-bold">{cluster.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Manual Complaint Form */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
            <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-orange-400" />
              Log Individual Student Complaint
            </h4>
            <form onSubmit={handleManualSubmit} className="space-y-2.5">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Building Block & Room</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customBlock}
                    onChange={(e) => setCustomBlock(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                    placeholder="e.g. Block B"
                  />
                  <input
                    type="text"
                    value={customRoom}
                    onChange={(e) => setCustomRoom(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                    placeholder="e.g. Room B204"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Issue Description</label>
                <input
                  type="text"
                  value={customIssue}
                  onChange={(e) => setCustomIssue(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  placeholder="e.g. AC compressor failure"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono text-xs font-bold transition-all cursor-pointer"
              >
                Submit Student Report
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (2 cols): Selected Cluster Deep-Dive */}
        <div className="lg:col-span-2 space-y-6">
          {currentCluster && (
            <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/15 space-y-6 backdrop-blur-xl">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-red-400 uppercase bg-red-950/60 border border-red-500/40 px-2.5 py-0.5 rounded">
                      INCIDENT TICKET #{currentCluster.id}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">SRM-AP Operations Hub</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">{currentCluster.issueType}</h3>
                </div>

                <div className="text-right shrink-0 bg-black/40 border border-white/10 rounded-2xl p-3">
                  <div className="text-[10px] font-mono text-zinc-400">CLUSTER INTENSITY</div>
                  <div className="text-2xl font-mono font-black text-amber-400">
                    {currentCluster.reportCount} <span className="text-xs text-zinc-400 font-normal">reports</span>
                  </div>
                </div>
              </div>

              {/* Spatial & Temporal Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 block mb-1">LOCATION</span>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    {currentCluster.block}, {currentCluster.room}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 block mb-1">FIRST REPORTED</span>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {currentCluster.firstReported}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono text-zinc-400 block mb-1">PRIORITY STATUS</span>
                  <div className="text-sm font-bold text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    {currentCluster.priority} EMERGENCY
                  </div>
                </div>
              </div>

              {/* Automated Dispatch Action Banner */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>AUTOMATED ACTION GENERATED BY CAMPUSOS:</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-mono">
                  {currentCluster.suggestedAction}
                </p>
              </div>

              {/* Individual Clustered Reports Stream */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center justify-between">
                  <span>Aggregated Student Submissions ({currentCluster.recentReports.length} visible)</span>
                  <span className="text-[10px] text-zinc-500">Spatial Proximity Match: 100%</span>
                </h4>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {currentCluster.recentReports.map((rep: ComplaintReport) => (
                    <div
                      key={rep.id}
                      className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-4 text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500">ID: {rep.studentId}</span>
                        <span className="text-white font-semibold">{rep.issueType}</span>
                      </div>
                      <span className="text-zinc-400 shrink-0 text-[11px]">{rep.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
