'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { GlassCard } from '@/components/ui/GlassCard';
import { Match, MatchCriteria } from '@/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Stats {
  total: number;
  avgScore: number;
  strong: number;   // >= 75
  partial: number;  // 50–74
  weak: number;     // < 50
  avgCriteria: MatchCriteria;
}

function computeStats(matches: Match[]): Stats {
  const total = matches.length;
  if (total === 0) {
    return { total: 0, avgScore: 0, strong: 0, partial: 0, weak: 0,
      avgCriteria: { experience: 0, skills: 0, industry: 0, job_titles: 0 } };
  }

  const avgScore = Math.round(matches.reduce((s, m) => s + m.match_score, 0) / total);
  const strong  = matches.filter((m) => m.match_score >= 75).length;
  const partial = matches.filter((m) => m.match_score >= 50 && m.match_score < 75).length;
  const weak    = matches.filter((m) => m.match_score < 50).length;

  const keys: (keyof MatchCriteria)[] = ['experience', 'skills', 'industry', 'job_titles'];
  const avgCriteria = keys.reduce((acc, key) => {
    acc[key] = Math.round(matches.reduce((s, m) => s + (m.matching_criteria[key] ?? 0), 0) / total);
    return acc;
  }, {} as MatchCriteria);

  return { total, avgScore, strong, partial, weak, avgCriteria };
}

const BAR_GRADIENTS = [
  'linear-gradient(to right, #f472b6, #a855f7)',
  'linear-gradient(to right, #38bdf8, #6366f1)',
  'linear-gradient(to right, #34d399, #06b6d4)',
  'linear-gradient(to right, #fb923c, #ec4899)',
];

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <GlassCard hoverEffect={false} className="text-center">
      <p className="text-xs uppercase tracking-widest text-white/50 mb-2">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
      {sub && <p className="text-xs text-white/40 mt-1">{sub}</p>}
    </GlassCard>
  );
}

function DistributionBar({ label, count, total, gradient }: {
  label: string; count: number; total: number; gradient: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-white/80">{label}</span>
        <span className="text-white/60">{count} <span className="text-white/40">({pct}%)</span></span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: gradient }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('matches')
        .select('match_score, matching_criteria');

      if (error) {
        setError(error.message);
      } else {
        setStats(computeStats(data as Match[]));
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <main className="min-h-screen text-white p-8 md:p-24">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-white/60 hover:text-white transition-colors text-sm mb-8 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter bg-gradient-to-r from-white via-pink-200 to-cyan-200 bg-clip-text text-transparent">
            Pipeline Analytics
          </h1>
          <p className="text-white/60 mt-1 text-sm">Aggregated across all processed candidates</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}

        {error && (
          <GlassCard className="text-center py-12">
            <p className="text-red-300 text-sm">Failed to load data: {error}</p>
            <p className="text-white/40 text-xs mt-2">Make sure the database schema has been run in Supabase.</p>
          </GlassCard>
        )}

        {!loading && !error && stats && (
          <div className="space-y-8">
            {/* Top stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Total Candidates" value={stats.total} />
              <StatCard
                label="Avg. Match Score"
                value={`${stats.avgScore}%`}
                sub={stats.total === 0 ? undefined : stats.avgScore >= 75 ? 'Strong pipeline' : stats.avgScore >= 50 ? 'Moderate pipeline' : 'Weak pipeline'}
              />
              <StatCard
                label="Strong Matches"
                value={stats.strong}
                sub={stats.total > 0 ? `${Math.round((stats.strong / stats.total) * 100)}% of candidates` : undefined}
              />
            </div>

            {/* Score distribution */}
            <GlassCard>
              <h2 className="text-sm uppercase tracking-widest text-white/50 mb-5">Score Distribution</h2>
              <div className="space-y-4">
                <DistributionBar label="Strong Match  (≥75%)" count={stats.strong}  total={stats.total} gradient="linear-gradient(to right, #34d399, #06b6d4)" />
                <DistributionBar label="Partial Match (50–74%)" count={stats.partial} total={stats.total} gradient="linear-gradient(to right, #fbbf24, #f59e0b)" />
                <DistributionBar label="Weak Match    (<50%)"  count={stats.weak}   total={stats.total} gradient="linear-gradient(to right, #f87171, #ec4899)" />
              </div>
            </GlassCard>

            {/* Avg criteria breakdown */}
            <GlassCard>
              <h2 className="text-sm uppercase tracking-widest text-white/50 mb-5">Avg. Criteria Scores</h2>
              {stats.total === 0 ? (
                <p className="text-white/40 text-sm text-center py-4">No data yet.</p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(stats.avgCriteria).map(([key, value], i) => (
                    <div key={key} className="bg-white/10 rounded-xl p-4 border border-white/15">
                      <div className="flex justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-white/50">{key.replace('_', ' ')}</span>
                        <span className="text-sm font-semibold text-white">{value}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${value}%`, background: BAR_GRADIENTS[i % BAR_GRADIENTS.length] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        )}
      </div>
    </main>
  );
}
