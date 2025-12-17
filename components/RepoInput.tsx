import React, { useState } from 'react';
import { SearchIcon } from './Icons';

interface RepoInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const RepoInput: React.FC<RepoInputProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-fg-muted" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-canvas-subtle border border-border-default rounded-md text-fg-default placeholder-fg-subtle focus:outline-none focus:border-accent-fg focus:ring-1 focus:ring-accent-fg shadow-inner text-sm md:text-base h-10 transition-all font-mono"
            placeholder="Paste GitHub URL (e.g., https://github.com/facebook/react)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!url || isLoading}
          className="bg-success-emphasis text-white px-5 py-2 rounded-md font-semibold text-sm hover:bg-[#2c974b] active:bg-[#298e46] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-[rgba(27,31,36,0.15)] h-10 whitespace-nowrap"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Repo'}
        </button>
      </form>
    </div>
  );
};

export default RepoInput;
