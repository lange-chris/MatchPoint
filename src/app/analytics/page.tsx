import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white mb-8 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-6 italic">Pipeline Analytics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-zinc-400 mb-1">Total Candidates</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-zinc-400 mb-1">Avg. Match Score</h3>
            <p className="text-2xl font-bold">0%</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-zinc-400 mb-1">Top Skill Gaps</h3>
            <p className="text-2xl font-bold italic">N/A</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <p className="text-zinc-400">Analysis data will appear here once you've processed multiple candidates.</p>
        </div>
      </div>
    </div>
  );
}
