import React from 'react';

interface LoadingOverlayProps {
  state: 'FETCHING_GITHUB' | 'ANALYZING';
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ state }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="mb-4">
        <div className="w-8 h-8 rounded-full border-[3px] border-border-default border-t-accent-fg animate-spin"></div>
      </div>
      <h3 className="text-base font-semibold text-fg-default mb-1">
        {state === 'FETCHING_GITHUB' ? 'Fetching repository data...' : 'Generating explanation...'}
      </h3>
      <p className="text-sm text-fg-muted text-center">
        {state === 'FETCHING_GITHUB'
          ? 'This usually takes less than a second.'
          : 'Our AI is reading the code and README.'}
      </p>
    </div>
  );
};

export default LoadingOverlay;
