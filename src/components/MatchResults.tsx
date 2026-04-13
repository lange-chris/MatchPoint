'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Match } from '@/types';
import { Target, MessageSquare, Award } from 'lucide-react';

interface MatchResultsProps {
  match?: Match;
  isLoading?: boolean;
}

const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getScoreColor(score: number): string {
  if (score >= 75) return '#4ade80'; // green-400
  if (score >= 50) return '#facc15'; // yellow-400
  return '#f87171';                  // red-400
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'Strong Match';
  if (score >= 50) return 'Partial Match';
  return 'Weak Match';
}

function ScoreRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(false);
  const color = getScoreColor(score);
  const offset = animated ? CIRCUMFERENCE * (1 - score / 100) : CIRCUMFERENCE;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
      <svg
        className="absolute inset-0 -rotate-90"
        width="144"
        height="144"
        viewBox="0 0 144 144"
      >
        {/* Track */}
        <circle
          cx="72" cy="72" r={RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
        />
        {/* Progress arc */}
        <circle
          cx="72" cy="72" r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease' }}
        />
      </svg>
      <div className="relative z-10 text-center leading-none">
        <span className="text-4xl font-black tabular-nums" style={{ color }}>
          {score}
        </span>
        <span className="text-base font-bold text-zinc-500">%</span>
      </div>
    </div>
  );
}

export default function MatchResults({ match, isLoading }: MatchResultsProps) {
  if (isLoading) {
    return (
      <GlassCard className="h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[320px]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <p className="text-zinc-400 text-sm">Analyzing candidate...</p>
      </GlassCard>
    );
  }

  if (!match) {
    return (
      <GlassCard className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 min-h-[320px]">
        <Target className="w-12 h-12 text-zinc-600" />
        <p className="text-zinc-500 text-sm">Analysis results will appear here after upload.</p>
      </GlassCard>
    );
  }

  const scoreColor = getScoreColor(match.match_score);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <GlassCard className="bg-white/[0.05]">

        {/* Header row: title + score ring */}
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Award className="text-yellow-500 w-5 h-5" />
              Analysis Result
            </h2>
            <p className="text-zinc-500 text-xs truncate max-w-[180px]">
              {match.candidate_name}
            </p>
            <span
              className="inline-block text-[10px] uppercase tracking-widest font-semibold mt-1"
              style={{ color: scoreColor }}
            >
              {getScoreLabel(match.match_score)}
            </span>
          </div>
          <ScoreRing score={match.match_score} />
        </div>

        {/* Criteria breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-8 mt-6">
          {Object.entries(match.matching_criteria).map(([key, value], i) => (
            <motion.div
              key={key}
              className="bg-white/5 p-3 rounded-xl border border-white/5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                  {key.replace('_', ' ')}
                </p>
                <span className="text-xs font-semibold text-zinc-300 tabular-nums">
                  {value}%
                </span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.08, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interview questions */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-zinc-300">
            <MessageSquare className="w-4 h-4 text-zinc-400" />
            Suggested Interview Questions
          </h3>
          <ul className="space-y-2">
            {match.interview_questions.map((q, i) => (
              <motion.li
                key={i}
                className="text-sm text-zinc-400 p-3 bg-white/[0.02] rounded-lg border border-white/5 flex gap-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.07, duration: 0.3 }}
              >
                <span className="text-zinc-600 text-xs shrink-0 mt-[1px]">{i + 1}.</span>
                <span>{q}</span>
              </motion.li>
            ))}
          </ul>
        </div>

      </GlassCard>
    </motion.div>
  );
}
