import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

export function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !authors) return;
    
    setIsSubmitting(true);
    // Simulate upload
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111] border border-red-900/30 p-12 rounded-3xl text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Paper Submitted!</h2>
          <p className="text-gray-400 mb-8">
            Thank you for contributing to VSScholar. Your research paper has been uploaded successfully and will be indexed shortly.
          </p>
          <Button onClick={() => { setSubmitted(false); setFile(null); setTitle(''); setAuthors(''); }} className="w-full">
            Upload Another Paper
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Scholar Portal</h1>
        <p className="text-gray-400">Contribute your research to the VSScholar database.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Paper Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#111] border border-red-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="e.g. Quantum Supremacy Using a Programmable Superconducting Processor"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Authors</label>
            <input 
              type="text" 
              required
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="w-full bg-[#111] border border-red-900/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              placeholder="e.g. John Doe, Jane Smith (comma separated)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Upload Document</label>
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${isDragging ? 'border-red-500 bg-red-950/20' : 'border-red-900/30 bg-[#111] hover:border-red-900/50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex flex-col items-center">
                <FileText className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-white font-medium mb-1">{file.name}</p>
                <p className="text-sm text-gray-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <Button type="button" variant="outline" size="sm" onClick={() => setFile(null)}>Remove File</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-950/30 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-white font-medium mb-2">Drag and drop your paper here</p>
                <p className="text-sm text-gray-500 mb-6">Supports PDF, DOCX, TXT up to 50MB</p>
                <label>
                  <Button type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                    Browse Files
                  </Button>
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-red-900/20 flex justify-end">
          <Button type="submit" size="lg" disabled={!file || !title || !authors || isSubmitting}>
            {isSubmitting ? 'Uploading...' : 'Submit Research'}
          </Button>
        </div>
      </form>
    </div>
  );
}
