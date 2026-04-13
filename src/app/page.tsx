export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24 bg-[#0a0a0a] text-white">
      <h1 className="text-6xl font-black mb-4 italic tracking-tighter">MatchPoint</h1>
      <p className="text-zinc-400 mb-12">Recruiter Edition | Vibe-Coding Enabled</p>
      
      <div className="flex gap-4">
        <a href="/history" className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
          View History
        </a>
        <a href="/analytics" className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors">
          Pipeline Stats
        </a>
      </div>
    </main>
  );
}
