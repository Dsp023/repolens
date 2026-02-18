import React, { useState } from 'react';
import RepoInput from './components/RepoInput';
import AnalysisResult from './components/AnalysisResult';
import LoadingOverlay from './components/LoadingOverlay';
import { AlertIcon, BookIcon, SunIcon, MoonIcon, GitHubIcon } from './components/Icons';
import { AppState, AppError, GitHubRepoData, RepoAnalysis } from './types';
import { parseGitHubUrl, fetchRepoData } from './services/githubService';
import { analyzeRepo } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [error, setError] = useState<AppError | null>(null);
  const [repoData, setRepoData] = useState<GitHubRepoData | null>(null);
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Apply theme to body
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleRepoSubmit = async (url: string) => {
    // Reset state
    setAppState('FETCHING_GITHUB');
    setError(null);
    setRepoData(null);
    setAnalysis(null);

    try {
      // 1. Parse URL
      const parsed = parseGitHubUrl(url);
      if (!parsed) {
        throw new Error('Invalid GitHub URL. Please use a format like "https://github.com/owner/repo".');
      }

      // 2. Fetch GitHub Data
      const data = await fetchRepoData(parsed.owner, parsed.repo);
      setRepoData(data);

      // 3. Analyze with AI
      setAppState('ANALYZING');
      const aiResult = await analyzeRepo(data);

      setAnalysis(aiResult);
      setAppState('SUCCESS');

    } catch (err: any) {
      setAppState('ERROR');
      setError({
        title: 'Something went wrong',
        message: err.message || 'An unexpected error occurred.',
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-canvas-default flex flex-col items-center selection:bg-accent-fg selection:text-white">

      {/* Header */}
      <header className="w-full bg-canvas-subtle border-b border-border-default py-4 px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookIcon className="w-8 h-8 text-fg-default" />
            <h1 className="text-xl font-semibold text-fg-default">
              RepoLens
            </h1>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-canvas-default border border-transparent hover:border-border-muted text-fg-muted transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className={`w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center ${appState === 'IDLE' ? 'flex-grow justify-center -mt-20' : ''}`}>

        {appState === 'IDLE' && (
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-fg-default tracking-tight mb-4">
              Understand code in seconds.
            </h2>
            <p className="text-lg md:text-xl text-fg-muted max-w-2xl mx-auto">
              Paste a GitHub repository URL to get a simple, AI-powered explanation.
            </p>
          </div>
        )}

        {/* Main Input */}
        {appState === 'IDLE ' || appState === 'ERROR' || appState === 'SUCCESS' ? (
          <RepoInput
            onSubmit={handleRepoSubmit}
            isLoading={appState === 'FETCHING_GITHUB' || appState === 'ANALYZING'}
          />
        ) : null}

        {/* Error State */}
        {appState === 'ERROR' && error && (
          <div className="w-full max-w-3xl bg-red-50 border border-danger-emphasis/20 rounded-md p-4 flex items-start gap-3 mb-8 animate-fade-in">
            <AlertIcon className="w-5 h-5 text-danger-fg shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-danger-fg">{error.title}</h4>
              <p className="text-sm text-danger-fg/90 mt-1">{error.message}</p>
            </div>
          </div>
        )}

        {/* Loading States */}
        {(appState === 'FETCHING_GITHUB'  || appState === 'ANALYZING') && (
          <LoadingOverlay state={appState} />
        )}

        {/* Results */}
        {appState === 'SUCCESS' && analysis && repoData && (
          <AnalysisResult data={analysis} repo={repoData} />
        )}
      </main>

      {/* Footer / Credits */}
      <footer className="mt-auto py-12 text-center  text-fg-muted text-xs border-t border-border-muted w-full">
        <div className="flex items-center justify-center gap-2">
          <span>Created by Devi Sri Prasad</span>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-fg-muted hover:text-fg-default transition-colors">
            <GitHubIcon className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
