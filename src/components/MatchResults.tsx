'use client';

import { GlassCard } from './ui/GlassCard';
import { Match } from '@/types';
import { Target, MessageSquare, Award } from 'lucide-react';

interface MatchResultsProps {
  match?: Match;
}

export default function MatchResults({ match }: MatchResultsProps) {
  if (!match) {
    return (
      <GlassCard className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
        <Target className="w-12 h-12 text-zinc-600" />
        <p className="text-zinc-500">Analysis results will appear here after upload.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <GlassCard className="bg-white/[0.05]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="text-yellow-500" />
            Analysis Result
          </h2>
          <div className="text-4xl font-black text-white italic">
            {match.match_score}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {Object.entries(match.matching_criteria).map(([key, value]) => (
            <div key={key} className="bg-white/5 p-3 rounded-lg border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{key.replace('_', ' ')}</p>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-1000" 
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-zinc-400" />
            Interview Questions
          </h3>
          <ul className="space-y-2">
            {match.interview_questions.map((q, i) => (
              <li key={i} className="text-sm text-zinc-400 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                {q}
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    </div>
  );
}
