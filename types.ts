// Define the shape of the data fetched from GitHub
export interface GitHubRepoData {
  owner: string;
  repo: string;
  description: string | null;
  readme: string;
  language: string | null;
  stars: number;
  url: string;
}


export interface RepoAnalysis {
  summary: string; // What does this project do?
  techStack: string[]; // Tech stack used
  structure: string; // Folder structure explained
  runInstructions: string; // How to run this project locally
  targetAudience: string; // Who should use or study this?
  pros: string[]; // Strengths of the project
  cons: string[]; // Weaknesses or areas for improvement
  setupScript: string; // One-click bash/powershell setup script
  healthScore: string; // A-F grade
  refactorSuggestions: string[]; // 3 actionable refactor suggestions
}

// Application state types
export type AppState = 'IDLE' | 'FETCHING_GITHUB' | 'ANALYZING' | 'SUCCESS' | 'ERROR';

export interface AppError {
  title: string;
  message: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
