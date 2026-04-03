import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, LogIn } from 'lucide-react';
import { Button } from './Button';

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-red-900/50 selection:text-red-200 flex flex-col">
      <header className="border-b border-red-900/30 bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-red-500">
            <BookOpen className="w-6 h-6" />
            <span className="text-xl font-semibold tracking-tight text-white">VS<span className="text-red-600">Scholar</span></span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}>Home</Link>
            <Link to="/search" className={`transition-colors ${location.pathname === '/search' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}>Search & Summarize</Link>
            <Link to="/upload" className={`transition-colors ${location.pathname === '/upload' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}>Scholar Portal</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-red-900/30 text-gray-300 hover:text-white">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
