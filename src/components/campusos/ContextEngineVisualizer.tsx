import React, { useState } from 'react';
import { Network, Database, Cpu, Bell, Activity, CheckCircle, Code } from 'lucide-react';

export const ContextEngineVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState<'silos' | 'core' | 'ai' | 'output'>('core');

  const silosData = [
    { name: 'Academic Records', icon: '🎓', count: '1,240 Course Records', status: 'Connected' },
    { name: 'Attendance System', icon: '📊', count: 'Real-time % Tracking', status: 'Connected' },
    { name: 'Timetable & GIS Venue', icon: '📅', count: 'Block A, B, C, APJ', status: 'Connected' },
    { name: 'Campus Events API', icon: '🎟️', count: 'Capacity & Nudges', status: 'Connected' },
    { name: 'Transport & Bus GPS', icon: '🚌', count: 'Bay 1 - Bay 6 Sync', status: 'Connected' },
    { name: 'Facility Maintenance', icon: '🚨', count: 'Spatial Cluster Engine', status: 'Connected' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-mono font-bold mb-2">
              <Network className="w-3.5 h-3.5" />
              <span>CONTEXT ENGINE LIVE ARCHITECTURE</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">How CAMPUSOS Connects Data Silos</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Click any stage in the pipeline to inspect data flow, spatial-temporal correlation algorithms, and nudge generation.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveStep('silos')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeStep === 'silos' ? 'bg-orange-500 text-slate-950 font-bold' : 'bg-white/5 text-zinc-400'
              }`}
            >
              1. Silos
            </button>
            <button
              onClick={() => setActiveStep('core')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeStep === 'core' ? 'bg-orange-500 text-slate-950 font-bold' : 'bg-white/5 text-zinc-400'
              }`}
            >
              2. Core Engine
            </button>
            <button
              onClick={() => setActiveStep('ai')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeStep === 'ai' ? 'bg-orange-500 text-slate-950 font-bold' : 'bg-white/5 text-zinc-400'
              }`}
            >
              3. AI Intelligence
            </button>
            <button
              onClick={() => setActiveStep('output')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeStep === 'output' ? 'bg-orange-500 text-slate-950 font-bold' : 'bg-white/5 text-zinc-400'
              }`}
            >
              4. Actions
            </button>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Step 1: Fragmented Silos */}
        <div
          onClick={() => setActiveStep('silos')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeStep === 'silos'
              ? 'bg-orange-950/20 border-orange-500 shadow-lg shadow-orange-950/30 ring-1 ring-orange-500/50'
              : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1">
              <Database className="w-4 h-4" /> STEP 1
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">Legacy SRM-AP Silos</h3>
          <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
            Ingests raw APIs without modifying underlying databases.
          </p>

          <div className="space-y-1.5">
            {silosData.slice(0, 3).map((silo, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-zinc-300 flex items-center justify-between">
                <span>{silo.icon} {silo.name}</span>
                <CheckCircle className="w-3 h-3 text-emerald-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Core Context Engine */}
        <div
          onClick={() => setActiveStep('core')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeStep === 'core'
              ? 'bg-orange-950/20 border-orange-500 shadow-lg shadow-orange-950/30 ring-1 ring-orange-500/50'
              : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1">
              <Cpu className="w-4 h-4" /> STEP 2
            </span>
            <Activity className="w-4 h-4 text-orange-400 animate-spin" />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">CAMPUSOS Context Core</h3>
          <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
            Spatial-temporal mapper & cross-system matrix correlation.
          </p>

          <div className="space-y-1.5 text-[11px] font-mono text-amber-300">
            <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30">
              ⚡ Spatial Clustering: 200m / 48h
            </div>
            <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-500/30">
              ⏱️ Walk-time Matrix: Block A → C
            </div>
          </div>
        </div>

        {/* Step 3: AI Intelligence Layer */}
        <div
          onClick={() => setActiveStep('ai')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeStep === 'ai'
              ? 'bg-orange-950/20 border-orange-500 shadow-lg shadow-orange-950/30 ring-1 ring-orange-500/50'
              : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1">
              <Code className="w-4 h-4" /> STEP 3
            </span>
            <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950 px-1.5 py-0.5 rounded">
              LLM + NLP
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mb-2">Decision Intelligence</h3>
          <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
            Generates context-aware nudges & priority escalations.
          </p>

          <div className="p-2 rounded-lg bg-blue-950/30 border border-blue-500/30 text-[11px] font-mono text-blue-200">
            🎯 Free Period Matching (3:30 - 6:00 PM)
          </div>
        </div>

        {/* Step 4: Actionable Outputs */}
        <div
          onClick={() => setActiveStep('output')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeStep === 'output'
              ? 'bg-orange-950/20 border-orange-500 shadow-lg shadow-orange-950/30 ring-1 ring-orange-500/50'
              : 'bg-zinc-900/60 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-orange-400 flex items-center gap-1">
              <Bell className="w-4 h-4" /> STEP 4
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
              LIVE NUDGES
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mb-2">Connected Action Outputs</h3>
          <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
            Pushes student alerts, admin maintenance tickets & bus sync.
          </p>

          <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] font-mono text-emerald-200">
            ✅ 1-Tap Action Feed Ready
          </div>
        </div>
      </div>

      {/* JSON Live Stream Inspector */}
      <div className="p-6 rounded-3xl bg-[#09090d] border border-white/10 font-mono space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-xs font-bold text-orange-400 flex items-center gap-2">
            <Code className="w-4 h-4" />
            LIVE CONTEXT STREAM INSPECTOR — [{activeStep.toUpperCase()} NODE]
          </span>
          <span className="text-[10px] text-zinc-500">Latency: 14ms | Payload Valid</span>
        </div>

        <pre className="text-xs text-amber-200/90 overflow-x-auto p-4 rounded-2xl bg-black/60 border border-white/5 leading-relaxed">
{activeStep === 'silos' && `[
  { "source": "SRM_ACADEMICS_API", "subject": "CSE204", "attendance": 74.0, "status": "BELOW_75_THRESHOLD" },
  { "source": "SRM_TIMETABLE_GIS", "subject": "CSE204", "room": "C102", "originalRoom": "B204", "relocated": true },
  { "source": "SRM_MAINTENANCE_LOG", "block": "Block B", "room": "Room B204", "issue": "AC Failure", "count": 17 }
]`}
{activeStep === 'core' && `{
  "context_engine": "CAMPUSOS_V1",
  "spatial_map": {
    "student_current_block": "Block A",
    "target_venue": "Block C (Room C102)",
    "walk_distance_meters": 850,
    "calculated_walk_time_mins": 12
  },
  "cluster_matrix": {
    "spatial_cluster_id": "cls-101",
    "matched_reports": 17,
    "severity": "CRITICAL_INFRASTRUCTURE"
  }
}`}
{activeStep === 'ai' && `{
  "ai_nudge_generator": {
    "student_alert": "CSE204 moved to Block C (12 min walk). Attendance 74% requires presence.",
    "admin_alert": "HIGH PRIORITY: Room B204 AC failure cluster (17 reports in 48h). Maintenance dispatched.",
    "event_recommendation": "Qiskit AI Workshop at 5 PM matched (free period 3:30-6:00 PM)."
  }
}`}
{activeStep === 'output' && `{
  "action_feed_outputs": [
    { "type": "STUDENT_HUB_CARD", "priority": 1, "target": "AP211100101" },
    { "type": "ADMIN_OPERATIONS_DISPATCH", "priority": 1, "target": "MAINTENANCE_DEPT" },
    { "type": "BUS_TIMETABLE_SYNC", "priority": 2, "target": "MOBILITY_LAYER" }
  ]
}`}
        </pre>
      </div>
    </div>
  );
};
