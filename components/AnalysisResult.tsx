import React from 'react';
import { GitHubRepoData, RepoAnalysis } from '../types';
import InteractiveFileTree from './InteractiveFileTree';
import {
  BookIcon,
  CodeIcon,
  FolderIcon,
  TerminalIcon,
  UsersIcon,
  GitHubIcon,
  StarIcon
} from './Icons';

interface AnalysisResultProps {
  data: RepoAnalysis;
  repo: GitHubRepoData;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, repo }) => {
  return (
    <div className="w-full max-w-5xl mx-auto pb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      {/* Header Info */}
      <div className="mb-6 px-1">
        <h2 className="text-2xl font-semibold text-fg-default flex items-center gap-2 mb-2">
          <GitHubIcon className="w-6 h-6 text-fg-muted" />
          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-accent-fg">
            {repo.owner}
          </a>
          <span className="text-fg-muted">/</span>
          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="hover:underline font-bold text-fg-default">
            {repo.repo}
          </a>
          <span className="ml-2 px-2 py-0.5 rounded-2xl bg-canvas-subtle border border-border-default text-xs text-fg-muted font-medium">
            Public
          </span>
        </h2>
        <div className="flex items-center gap-4 text-sm text-fg-muted">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#f1e05a] border border-black/10"></span>
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1 hover:text-accent-fg cursor-pointer transition-colors">
            <StarIcon className="w-4 h-4" />
            {repo.stars.toLocaleString()} stars
          </span>
          <span className="text-xs">Updated recently</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
            ['A', 'B'].some(grade => data.healthScore?.includes(grade)) ? 'bg-success-fg/10 text-success-fg border-success-fg/20' :
            ['C', 'D'].some(grade => data.healthScore?.includes(grade)) ? 'bg-attention-fg/10 text-attention-fg border-attention-fg/20' :
            'bg-danger-fg/10 text-danger-fg border-danger-fg/20'
          }`}>
            Health: {data.healthScore || 'N/A'}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-accent-muted/10 text-accent-fg border border-accent-muted/20 text-xs font-medium">
            ⏱️ {data.setupTime || 'Unknown Setup Time'}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-done-fg/10 text-done-fg border border-done-fg/20 text-xs font-medium">
            ✨ {data.projectVibe || 'Vibe: Unknown'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Summary */}
          <div className="border border-border-default rounded-md bg-canvas-default overflow-hidden hover:border-accent-fg transition-colors group">
            <div className="bg-canvas-subtle px-4 py-3 border-b border-border-default flex items-center justify-between group-hover:bg-accent-muted/10 transition-colors">
              <h3 className="text-sm font-semibold text-fg-default">About the project</h3>
              <BookIcon className="w-4 h-4 text-fg-muted group-hover:text-accent-fg" />
            </div>
            <div className="p-6">
              <p className="text-fg-default leading-relaxed text-base">
                {data.summary}
              </p>
            </div>
          </div>

          {/* Card 6: Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border border-border-default rounded-md bg-canvas-default overflow-hidden">
              <div className="bg-canvas-subtle px-4 py-3 border-b border-border-default flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-fg"></div>
                <h3 className="text-sm font-semibold text-fg-default uppercase tracking-wider">Strengths</h3>
              </div>
              <ul className="p-6 space-y-3 list-disc list-inside text-sm text-fg-default">
                {data.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>
            <div className="border border-border-default rounded-md bg-canvas-default overflow-hidden">
              <div className="bg-canvas-subtle px-4 py-3 border-b border-border-default flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-danger-fg"></div>
                <h3 className="text-sm font-semibold text-fg-default uppercase tracking-wider">Limitations</h3>
              </div>
              <ul className="p-6 space-y-3 list-disc list-inside text-sm text-fg-default">
                {data.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 4: Folder Structure */}
          <div className="border border-border-default rounded-md bg-canvas-default overflow-hidden">
            <div className="bg-canvas-subtle px-4 py-3 border-b border-border-default flex items-center gap-2">
              <FolderIcon className="w-4 h-4 text-fg-muted" />
              <h3 className="text-sm font-semibold text-fg-default">Interactive File Structure</h3>
            </div>
            <div className="p-4 bg-canvas-default">
              {repo.tree && repo.tree.length > 0 ? (
                <InteractiveFileTree 
                  repo={repo} 
                  onFileSelect={(path) => {
                    alert(`Selected file: ${path}\n\n(In a full implementation, this would trigger Gemini to explain this specific file.)`);
                  }} 
                />
              ) : (
                <pre className="font-mono text-xs md:text-sm text-fg-default leading-relaxed whitespace-pre-wrap text-wrap">
                  {data.structure}
                </pre>
              )}
            </div>
          </div>

          {/* Card 5: How to Run */}
          <div className="border border-border-default rounded-md bg-canvas-default overflow-hidden">
            <div className="bg-canvas-subtle px-4 py-3 border-b border-border-default flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-fg-muted" />
              <h3 className="text-sm font-semibold text-fg-default">Getting Started</h3>
            </div>
            <div className="p-6">
              <div className="prose prose-sm max-w-none text-fg-default">
                <div className="whitespace-pre-wrap font-mono text-sm bg-canvas-subtle p-4 rounded-md border border-border-default overflow-x-auto">
                  {data.runInstructions}
                </div>
              </div>
            </div>
          </div>

          {/* Card: Setup Script */}
          {data.setupScript && (
            <div className="border border-border-default rounded-md bg-canvas-default overflow-hidden">
              <div className="bg-canvas-subtle px-4 py-3 border-b border-border-default flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-fg-muted" />
                <h3 className="text-sm font-semibold text-fg-default">One-Click Setup Script</h3>
              </div>
              <div className="p-6">
                <div className="prose prose-sm max-w-none text-fg-default">
                  <div className="whitespace-pre-wrap font-mono text-sm bg-canvas-subtle p-4 rounded-md border border-border-default overflow-x-auto text-accent-fg">
                    {data.setupScript}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">

          {/* Card 3: Target Audience */}
          <div className="border border-border-default rounded-md bg-canvas-default overflow-hidden">
            <div className="px-4 py-3 border-b border-border-default">
              <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Target Audience</h3>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-3">
                <UsersIcon className="w-5 h-5 text-fg-muted mt-0.5" />
                <p className="text-sm text-fg-default leading-relaxed">
                  {data.targetAudience}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Tech Stack */}
          <div className="border border-border-default rounded-md bg-canvas-default overflow-hidden">
            <div className="px-4 py-3 border-b border-border-default">
              <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Languages & Tools</h3>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-1.5">
                {data.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-0.5 rounded-full bg-canvas-subtle text-fg-default border border-border-default text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Refactor Suggestions */}
          {data.refactorSuggestions && data.refactorSuggestions.length > 0 && (
            <div className="border border-border-default rounded-md bg-canvas-default overflow-hidden">
              <div className="px-4 py-3 border-b border-border-default flex items-center gap-2">
                <CodeIcon className="w-4 h-4 text-fg-muted" />
                <h3 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Refactoring Ideas</h3>
              </div>
              <ul className="p-4 space-y-3 list-disc list-inside text-sm text-fg-default">
                {data.refactorSuggestions.map((suggestion, i) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AnalysisResult;
