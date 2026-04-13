'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { GlassCard } from './ui/GlassCard';

export default function JDInput() {
  const [jdText, setJdText] = useState('');

  return (
    <GlassCard className="w-full">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Step 1: Job Description</h2>
          <Button variant="ghost" size="sm">Clear</Button>
        </div>
        
        <textarea
          className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-zinc-300 focus:outline-none focus:border-white/20 transition-colors resize-none"
          placeholder="Paste the job advertisement text here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />

        <div className="flex gap-2">
          <Button className="flex-1" variant="outline">
            Scrape from URL
          </Button>
          <Button className="flex-1" disabled={!jdText}>
            Confirm JD
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
