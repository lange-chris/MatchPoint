'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { GlassCard } from './ui/GlassCard';

interface JDInputProps {
  onConfirm: (jdText: string) => void;
}

export default function JDInput({ onConfirm }: JDInputProps) {
  const [jdText, setJdText] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState('');

  const handleClear = () => {
    setJdText('');
    setShowUrlInput(false);
    setUrl('');
    setScrapeError('');
  };

  const handleScrape = async () => {
    if (!url.trim()) return;
    setIsScraping(true);
    setScrapeError('');
    try {
      // Mock: in production this would call /api/scrape?url=...
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setJdText(
        `[Scraped from ${url}]\n\nWe are looking for a talented professional to join our team. ` +
        `This is a placeholder — wire up a real scraping API when ready.`
      );
      setShowUrlInput(false);
      setUrl('');
    } catch {
      setScrapeError('Could not scrape that URL. Paste the text manually instead.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleConfirm = () => {
    if (jdText.trim()) {
      onConfirm(jdText.trim());
    }
  };

  return (
    <GlassCard className="w-full">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Step 1: Job Description</h2>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear
          </Button>
        </div>

        {showUrlInput && (
          <div className="flex gap-2">
            <input
              type="url"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-white/20 transition-colors"
              placeholder="https://example.com/job-posting"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
            />
            <Button variant="secondary" size="sm" onClick={handleScrape} isLoading={isScraping}>
              Go
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowUrlInput(false)}>
              Cancel
            </Button>
          </div>
        )}

        {scrapeError && (
          <p className="text-xs text-red-400">{scrapeError}</p>
        )}

        <textarea
          className="w-full h-48 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-zinc-300 focus:outline-none focus:border-white/20 transition-colors resize-none"
          placeholder="Paste the job advertisement text here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />

        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant="outline"
            onClick={() => setShowUrlInput((prev) => !prev)}
          >
            Scrape from URL
          </Button>
          <Button className="flex-1" disabled={!jdText.trim()} onClick={handleConfirm}>
            Confirm JD
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
