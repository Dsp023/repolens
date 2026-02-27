import React, { useState } from 'react';
import { GitHubRepoData } from '../types';
import { FolderIcon, CodeIcon } from './Icons';

interface InteractiveFileTreeProps {
  repo: GitHubRepoData;
  onFileSelect: (path: string) => void;
}

const InteractiveFileTree: React.FC<InteractiveFileTreeProps> = ({ repo, onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  if (!repo.tree || repo.tree.length === 0) {
    return <div className="p-4 text-sm text-fg-muted">File tree not available.</div>;
  }

  // Build a simple nested structure
  const root: any = { files: [], folders: {} };
  
  repo.tree.forEach((node) => {
    const parts = node.path.split('/');
    let current = root;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current.folders[part]) {
        current.folders[part] = { files: [], folders: {} };
      }
      current = current.folders[part];
    }
    
    const name = parts[parts.length - 1];
    if (node.type === 'blob') {
      current.files.push({ name, path: node.path });
    }
  });

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTree = (node: any, pathPrefix: string = '', level: number = 0) => {
    return (
      <div className={`ml-${level > 0 ? 4 : 0}`}>
        {Object.keys(node.folders).sort().map((folderName) => {
          const currentPath = pathPrefix ? `${pathPrefix}/${folderName}` : folderName;
          const isExpanded = expandedFolders.has(currentPath);
          return (
            <div key={currentPath}>
              <div 
                className="flex items-center gap-2 py-1 px-2 hover:bg-canvas-subtle rounded-md cursor-pointer text-sm text-fg-default group"
                onClick={() => toggleFolder(currentPath)}
              >
                <FolderIcon className={`w-4 h-4 ${isExpanded ? 'text-accent-fg' : 'text-fg-muted'} group-hover:text-accent-fg transition-colors`} />
                <span>{folderName}</span>
              </div>
              {isExpanded && renderTree(node.folders[folderName], currentPath, level + 1)}
            </div>
          );
        })}
        {node.files.sort((a: any, b: any) => a.name.localeCompare(b.name)).map((file: any) => (
          <div 
            key={file.path}
            className="flex items-center gap-2 py-1 px-2 ml-4 hover:bg-canvas-subtle rounded-md cursor-pointer text-sm text-fg-muted hover:text-accent-fg transition-colors group"
            onClick={() => onFileSelect(file.path)}
          >
            <CodeIcon className="w-4 h-4 opacity-70 group-hover:opacity-100" />
            <span className="truncate">{file.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="font-mono text-sm max-h-96 overflow-y-auto custom-scrollbar">
      {renderTree(root)}
    </div>
  );
};

export default InteractiveFileTree;
