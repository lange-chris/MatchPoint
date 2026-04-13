'use client';

import { useState } from 'react';
import JDInput from "@/components/JDInput";
import CVUpload from "@/components/CVUpload";
import MatchResults from "@/components/MatchResults";
import { Button } from '@/components/ui/Button';
import { Match } from '@/types';

export default function Home() {
  const [jdText, setJdText] = useState<string | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [match, setMatch] = useState<Match | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleJDConfirm = (text: string) => {
    setJdText(text);
    console.log('JD Successfully confirmed');
  };

  const handleUploadComplete = (url: string) => {
    setCvUrl(url);
    console.log('CV Successfully uploaded:', url);
  };

  const handleRunAnalysis = async () => {
    if (!jdText || !cvUrl) return;

    setIsLoading(true);
    setMatch(undefined);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          jd_text: jdText,
          cv_text: 'Pending extraction...', // Future: Implement text extraction
          cv_url: cvUrl 
        }),
      });
      const json = await res.json();
      if (json.success) setMatch(json.data);
    } catch (error) {
      console.error('Analysis failed:', error);
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
          {/* Input Flow (Isis & Chris) */}
          <div className="space-y-8">
            <JDInput onConfirm={handleJDConfirm} />
            <CVUpload onUploadComplete={handleUploadComplete} />
            
            <Button
              className="w-full"
              onClick={handleRunAnalysis}
              isLoading={isLoading}
              disabled={isLoading || !cvUrl || !jdText}
            >
              {!jdText ? 'Confirm JD first' : !cvUrl ? 'Upload CV first' : 'Run Analysis'}
            </Button>
          </div>

          {/* Results View (Julia) */}
          <div className="lg:sticky lg:top-8">
            <MatchResults match={match} />
          </div>
        </div>
      </div>
    </main>
  );
}
