'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { Match } from '@/types';
import { ChevronDown, ExternalLink, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getScoreColor(score: number) {
  if (score >= 75) return { text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' };
  if (score >= 50) return { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
  return { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' };
}

function getScoreLabel(score: number) {
  if (score >= 75) return 'Strong';
  if (score >= 50) return 'Partial';
  return 'Weak';
}

function MatchRow({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false);
  const colors = getScoreColor(match.match_score);
  const date = new Date(match.created_at).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      {/* Row */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{match.candidate_name}</p>
          <p className="text-xs text-zinc-500 truncate">{match.job_title}</p>
        </div>

        <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${colors.text} ${colors.bg} ${colors.border}`}>
          {match.match_score}% · {getScoreLabel(match.match_score)}
        </div>

        <div className="shrink-0 flex items-center gap-1 text-xs text-zinc-600">
          <Clock className="w-3 h-3" />
          {date}
        </div>

        {match.cv_url && (
          <a
            href={match.cv_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-zinc-600 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        <ChevronDown
          className={`shrink-0 w-4 h-4 text-zinc-600 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded: criteria + questions */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4 space-y-4 bg-white/[0.02]">
              {/* Criteria */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(match.matching_criteria).map(([key, value]) => (
                  <div key={key} className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500">{key.replace('_', ' ')}</span>
                      <span className="text-xs font-semibold text-zinc-300">{value}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Interview questions */}
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Interview Questions</p>
                <ul className="space-y-1.5">
                  {match.interview_questions.map((q, i) => (
                    <li key={i} className="text-sm text-zinc-400 flex gap-2">
                      <span className="text-zinc-600 shrink-0">{i + 1}.</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HistoryPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setMatches(data ?? []);
      }
      setLoading(false);
    }
    fetchMatches();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 md:p-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm mb-8 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter">Match History</h1>
            <p className="text-zinc-500 mt-1 text-sm">
              {loading ? '...' : `${matches.length} candidate${matches.length !== 1 ? 's' : ''} processed`}
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}

        {error && (
          <GlassCard className="text-center py-12">
            <p className="text-red-400 text-sm">Failed to load matches: {error}</p>
            <p className="text-zinc-600 text-xs mt-2">Make sure the database schema has been run in Supabase.</p>
          </GlassCard>
        )}

        {!loading && !error && matches.length === 0 && (
          <GlassCard className="text-center py-16">
            <p className="text-zinc-400">No matches yet.</p>
            <p className="text-zinc-600 text-sm mt-1">Run an analysis on the dashboard to see results here.</p>
          </GlassCard>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="space-y-3">
            {matches.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
