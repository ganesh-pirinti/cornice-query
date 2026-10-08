import React from 'react';
import { MapPin, Users, Sparkles, CheckCircle, Clock, Compass } from 'lucide-react';
import type { CampusEventItem } from '../../types/campusos';

interface EventIntelligenceViewProps {
  events: CampusEventItem[];
}

export const EventIntelligenceView: React.FC<EventIntelligenceViewProps> = ({ events }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner: Campus Event Intelligence */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-zinc-900 border border-blue-500/30 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CAMPUS EVENT INTELLIGENCE LAYER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Precision Context Event Recommendation
            </h2>
            <p className="text-zinc-300 text-sm mt-1 max-w-2xl leading-relaxed">
              CAMPUSOS replaces generic spam emails with decision intelligence: matching student free periods, venue walk times, seating capacity, and student passion tags.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-3 shrink-0">
            <div className="text-right">
              <div className="text-xs font-mono text-zinc-400">FREE PERIOD DETECTED</div>
              <div className="text-sm font-bold text-blue-400 font-mono">03:30 PM – 06:00 PM</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
              evt.recommended
                ? 'bg-blue-950/20 border-blue-500/50 shadow-xl shadow-blue-950/30 ring-1 ring-blue-500/30'
                : 'bg-zinc-900/60 border-white/10 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300">
                  {evt.category}
                </span>
                {evt.recommended ? (
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    MATCHES YOUR PROFILE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-400 bg-black/40 px-2 py-0.5 rounded">
                    CONFLICT DETECTED
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{evt.title}</h3>
                <p className="text-xs text-zinc-300 mt-2 font-mono leading-relaxed bg-black/40 p-3 rounded-xl border border-white/10">
                  💡 <strong>Contextual Nudge:</strong> {evt.reasonText}
                </p>
              </div>

              {/* Event Attributes */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-zinc-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{evt.location} ({evt.distanceMins}m walk)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Seats: {evt.registeredCount}/{evt.capacity}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{evt.matchingInterests.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="text-[11px] font-mono text-zinc-400">
                Venue: <strong className="text-white">{evt.location}</strong>
              </div>
              <button
                disabled={!evt.recommended}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  evt.recommended
                    ? 'bg-blue-500 hover:bg-blue-400 text-slate-950 shadow-md shadow-blue-500/20'
                    : 'bg-white/10 text-zinc-500 cursor-not-allowed'
                }`}
              >
                {evt.recommended ? '1-Tap RSVP & Sync' : 'Bus Departure Conflict'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
