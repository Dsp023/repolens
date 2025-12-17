import { GitHubRepoData } from '../types';

const GITHUB_API_BASE = 'https://api.github.com/repos';

/**
 * Extracts owner and repo name from a GitHub URL.
 * Supports:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo.git
 * - owner/repo
 */
export const parseGitHubUrl = (input: string): { owner: string; repo: string } | null => {
  try {
    let cleanInput = input.trim();
    
    // Remove .git suffix if present
    if (cleanInput.endsWith('.git')) {
      cleanInput = cleanInput.slice(0, -4);
    }

    // Handle full URL
    if (cleanInput.startsWith('http')) {
      const url = new URL(cleanInput);
      if (url.hostname !== 'github.com') return null;
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length < 2) return null;
      return { owner: parts[0], repo: parts[1] };
    }

    // Handle "owner/repo" format
    const parts = cleanInput.split('/');
    if (parts.length === 2) {
      return { owner: parts[0], repo: parts[1] };
    }

    return null;
  } catch (e) {
    return null;
  }
};

/**
 * Fetches repository metadata and README from GitHub.
 */
export const fetchRepoData = async (owner: string, repo: string): Promise<GitHubRepoData> => {
  const metaUrl = `${GITHUB_API_BASE}/${owner}/${repo}`;
  const readmeUrl = `${GITHUB_API_BASE}/${owner}/${repo}/readme`;

  // Parallel fetch for speed
  const [metaRes, readmeRes] = await Promise.all([
    fetch(metaUrl),
    fetch(readmeUrl, {
      headers: { 'Accept': 'application/vnd.github.raw+json' }
    })
  ]);

  if (!metaRes.ok) {
    if (metaRes.status === 404) {
      throw new Error('Repository not found. Please check the URL.');
    } else if (metaRes.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`GitHub API Error: ${metaRes.statusText}`);
  }

  const metaData = await metaRes.json();
  
  // README might not exist, handled gracefully
  let readmeContent = '';
  if (readmeRes.ok) {
    readmeContent = await readmeRes.text();
  } else {
    readmeContent = 'No README.md found in this repository.';
  }

  return {
    owner: metaData.owner.login,
    repo: metaData.name,
    description: metaData.description,
    language: metaData.language,
    stars: metaData.stargazers_count,
    url: metaData.html_url,
    readme: readmeContent,
  };
};
