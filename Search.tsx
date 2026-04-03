import React, { useState, useRef } from 'react';
import { Search, Upload, FileText, BookOpen, Loader2, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { searchLiterature, summarizeDocument, translateText, Paper } from '../lib/gemini';
import { Button } from '../components/Button';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Paper[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    setSummary('');
    setUploadedFileName('');
    setTargetLanguage('');
    
    try {
      const results = await searchLiterature(query);
      setSearchResults(results);
    } catch (error) {
      console.error(error);
      alert("Failed to search literature.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIsUploading(true);
    setSummary('');
    setSearchResults([]);
    setQuery('');
    setTargetLanguage('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const result = await summarizeDocument(base64String, file.type);
        setSummary(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      alert("Failed to summarize document.");
      setIsUploading(false);
    }
  };

  const handleTranslate = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setTargetLanguage(lang);
    if (!lang || !summary) return;

    setIsTranslating(true);
    try {
      const translated = await translateText(summary, lang);
      setSummary(translated);
    } catch (error) {
      console.error(error);
      alert("Failed to translate summary.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-3">Search & Summarize</h1>
        <p className="text-gray-400">Find academic papers or upload your own for instant AI analysis.</p>
      </div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111] border border-red-900/20 rounded-2xl p-2 shadow-2xl shadow-red-900/5"
      >
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for papers, authors, or topics..."
              className="w-full h-14 pl-12 pr-4 bg-black/50 border border-transparent focus:border-red-900/50 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-red-900/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="h-14 px-8 rounded-xl text-base" disabled={isSearching || isUploading || isTranslating}>
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </Button>
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.txt,.doc,.docx"
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                className="h-14 px-6 rounded-xl border-red-900/30 hover:border-red-700 hover:bg-red-950/30"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSearching || isUploading || isTranslating}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Status / Loading */}
      <AnimatePresence>
        {(isSearching || isUploading || isTranslating) && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center py-12 text-red-500"
          >
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium animate-pulse">
                {isSearching ? 'Searching academic databases...' : isUploading ? 'Analyzing and summarizing document...' : 'Translating summary...'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <div className="mt-12">
        {/* Search Results */}
        {searchResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-500" />
              Search Results
            </h2>
            <div className="grid gap-4">
              {searchResults.map((paper, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-[#111] border border-red-900/20 p-6 rounded-xl hover:border-red-900/50 transition-colors group"
                >
                  <h3 className="text-lg font-medium text-red-400 group-hover:text-red-300 transition-colors mb-2">
                    {paper.link ? <a href={paper.link} target="_blank" rel="noreferrer" className="hover:underline">{paper.title}</a> : paper.title}
                  </h3>
                  <div className="text-sm text-gray-400 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="text-gray-300">{paper.authors.join(', ')}</span>
                    <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-800"></span> {paper.year}</span>
                    <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-800"></span> {paper.journal}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {paper.abstract}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button variant="outline" size="sm" className="text-xs border-red-900/30">Save</Button>
                    <Button variant="ghost" size="sm" className="text-xs">Cite</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Summary Result */}
        {summary && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-red-900/30 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="bg-black/50 border-b border-red-900/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-950/50 rounded-lg text-red-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-medium text-white">Document Summary</h2>
                  <p className="text-xs text-gray-500">{uploadedFileName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select 
                    value={targetLanguage}
                    onChange={handleTranslate}
                    disabled={isTranslating}
                    className="pl-9 pr-8 py-2 bg-[#1a1a1a] border border-red-900/30 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-red-500 appearance-none cursor-pointer"
                  >
                    <option value="">Translate...</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Chinese (Simplified)">Chinese</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Arabic">Arabic</option>
                  </select>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setSummary(''); setUploadedFileName(''); setTargetLanguage(''); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 md:p-8 prose prose-invert prose-red max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mt-6 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-red-400 mt-6 mb-3 border-b border-red-900/20 pb-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-medium text-gray-200 mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="text-gray-300 leading-relaxed mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                }}
              >
                {summary}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
