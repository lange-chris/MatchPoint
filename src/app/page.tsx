'use client';

import { useState } from 'react';
import JDInput from '@/components/JDInput';
import CVUpload from '@/components/CVUpload';
import MatchResults from '@/components/MatchResults';
import { Button } from '@/components/ui/Button';
import { Match } from '@/types';

export default function Home() {
  const [match, setMatch] = useState<Match | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Triggers the analysis against the mock /api/match endpoint.
  // TODO (Julia → Isis + Chris): Replace this standalone button with a callback
  // passed into CVUpload once Chris wires up onUploadComplete(cvUrl, cvText)
  // and Isis wires up onJDConfirmed(jdText). At that point, call handleRunAnalysis
  // with the real jd_text, cv_text, and cv_url values.
  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setMatch(undefined);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd_text: 'demo', cv_text: 'demo', cv_url: '' }),
      });
      const json = await res.json();
      if (json.success) setMatch(json.data);
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Input Flow — Isis (JDInput) & Chris (CVUpload) — do not edit these components */}
          <div className="space-y-8">
            <JDInput />
            <CVUpload />
            <Button
              className="w-full"
              onClick={handleRunAnalysis}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Run Analysis
            </Button>
          </div>

          {/* Results View — Julia */}
          <div className="lg:sticky lg:top-8">
            <MatchResults match={match} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
