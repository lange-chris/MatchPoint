'use client';

import { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { GlassCard } from './ui/GlassCard';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface CVUploadProps {
  onUploadComplete?: (url: string) => void;
}

export default function CVUpload({ onUploadComplete }: CVUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setUploadSuccess(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setUploadSuccess(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // 1. Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `cvs/${fileName}`;

      // 2. Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cv-uploads')
        .getPublicUrl(filePath);

      setUploadSuccess(true);
      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Something went wrong during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <GlassCard className="w-full">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Step 2: Candidate CV</h2>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange}
          className="hidden" 
          accept=".pdf,.doc,.docx"
        />

        <div 
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center space-y-4 transition-all cursor-pointer bg-white/[0.02]",
            isDragActive ? "border-white bg-white/[0.05]" : "border-white/10 hover:border-white/20",
            uploadSuccess && "border-green-500/50 bg-green-500/[0.02]"
          )}
        >
          {uploadSuccess ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-green-500" />
              <div className="text-center">
                <p className="text-white font-medium">Upload Successful!</p>
                <p className="text-zinc-500 text-sm">CV is ready for analysis</p>
              </div>
            </>
          ) : file ? (
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

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        {!uploadSuccess && (
          <Button 
            onClick={handleUpload}
            className="w-full" 
            disabled={!file || isUploading}
            isLoading={isUploading}
          >
            {file ? 'Upload & Analyze CV' : 'Select File'}
          </Button>
        )}

        {uploadSuccess && (
          <Button 
            onClick={() => {
              setFile(null);
              setUploadSuccess(false);
            }}
            variant="ghost" 
            className="w-full"
          >
            Upload Another
          </Button>
        )}
      </div>
    </GlassCard>
  );
}
