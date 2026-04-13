import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white mb-8 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-6 italic">Match History</h1>
        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
          <p className="text-zinc-400">No matches found yet. Start by uploading a CV on the home page.</p>
        </div>
      </div>
    </div>
  );
}
