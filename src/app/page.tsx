'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd_text: jdText, cv_url: cvUrl }),
      });
      const json = await res.json();
      if (json.success) {
        setMatch(json.data);
      } else {
        setError(json.error ?? 'Analysis failed. Please try again.');
      }
    } catch (err) {
      setError('Could not reach the server. Please try again.');
      console.error('Analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-white p-8 md:p-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-6xl font-black italic tracking-tighter bg-gradient-to-r from-white via-pink-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">MatchPoint</h1>
            <p className="text-white/70 mt-2">Recruiter Edition | Multi-Agent Collaborative Project</p>
          </div>
          <div className="flex gap-4">
            <Link href="/history" className="text-sm text-white/60 hover:text-white transition-colors">History</Link>
            <Link href="/analytics" className="text-sm text-white/60 hover:text-white transition-colors">Analytics</Link>
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
            {error && (
              <p className="text-sm text-white bg-red-500/30 border border-red-300/40 rounded-lg px-4 py-3 backdrop-blur-sm">
                {error}
              </p>
            )}
          </div>

          {/* Results View (Julia) */}
          <div className="lg:sticky lg:top-8">
            <MatchResults match={match} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
