import JDInput from "@/components/JDInput";
import CVUpload from "@/components/CVUpload";
import MatchResults from "@/components/MatchResults";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8 md:p-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter">MatchPoint</h1>
            <p className="text-zinc-400 mt-2">Recruiter Edition | Multi-Agent Collaborative Project</p>
          </div>
          <div className="flex gap-4">
            <a href="/history" className="text-sm text-zinc-500 hover:text-white transition-colors">History</a>
            <a href="/analytics" className="text-sm text-zinc-500 hover:text-white transition-colors">Analytics</a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Flow (Isis & Chris) */}
          <div className="space-y-8">
            <JDInput />
            <CVUpload />
          </div>

          {/* Results View (Julia) */}
          <div className="lg:sticky lg:top-8">
            <MatchResults />
          </div>
        </div>
      </div>
    </main>
  );
}
