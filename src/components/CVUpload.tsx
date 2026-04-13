'use client';

import { useState } from 'react';
import { Button } from './ui/Button';
import { GlassCard } from './ui/GlassCard';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

export default function CVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <GlassCard className="w-full">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Step 2: Candidate CV</h2>
        
        <div 
          className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center space-y-4 hover:border-white/20 transition-colors cursor-pointer bg-white/[0.02]"
        >
          {file ? (
            <>
              <FileText className="w-12 h-12 text-white" />
              <div className="text-center">
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-zinc-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-zinc-500" />
              <div className="text-center">
                <p className="text-zinc-300">Drag & drop CV here</p>
                <p className="text-zinc-500 text-sm">PDF or Word (max 5MB)</p>
              </div>
            </>
          )}
        </div>

        <Button 
          className="w-full" 
          disabled={!file || isUploading}
          isLoading={isUploading}
        >
          {file ? 'Upload & Analyze CV' : 'Select File'}
        </Button>
      </div>
    </GlassCard>
  );
}
