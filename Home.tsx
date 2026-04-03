import React from 'react';
import { motion } from 'motion/react';
import { Search, Upload, Zap, Globe, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Academic Research</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            VSScholar empowers researchers and students with AI-driven literature search, instant document summarization, and seamless global translation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Start Searching
              </Button>
            </Link>
            <Link to="/upload">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 border-red-900/50">
                Scholar Portal
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#0a0a0a] border-t border-red-900/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose VSScholar?</h2>
            <p className="text-gray-400">Designed for modern academics who value speed, accuracy, and accessibility.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="w-8 h-8 text-red-500" />}
              title="Intelligent Search"
              description="Find highly relevant academic papers instantly using our advanced AI-powered search engine."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-red-500" />}
              title="Instant Summaries"
              description="Upload any research paper and get a comprehensive, structured summary in seconds."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-red-500" />}
              title="Global Translation"
              description="Break language barriers. Translate complex academic summaries into any language with one click."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-[#111] border border-red-900/20 p-8 rounded-2xl hover:border-red-900/50 transition-colors">
      <div className="bg-red-950/30 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
