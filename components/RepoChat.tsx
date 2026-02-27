import React, { useState } from 'react';
import { GitHubRepoData, ChatMessage } from '../types';
import { chatWithRepo } from '../services/geminiService';

interface RepoChatProps {
  repoData: GitHubRepoData;
}

const RepoChat: React.FC<RepoChatProps> = ({ repoData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithRepo(repoData, messages, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mt-8 bg-canvas-subtle border border-border-default rounded-md overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border-default bg-canvas-default">
        <h3 className="text-lg font-semibold text-fg-default">Talk to the Repo</h3>
        <p className="text-sm text-fg-muted">Ask anything about this codebase.</p>
      </div>

      <div className="p-4 flex flex-col gap-4 h-64 overflow-y-auto bg-canvas-default">
        {messages.length === 0 && (
          <p className="text-sm text-fg-muted text-center mt-auto mb-auto">
            No messages yet. Ask a question!
          </p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-md text-sm ${msg.role === 'user' ? 'bg-accent-emphasis text-white' : 'bg-canvas-subtle text-fg-default border border-border-default'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-3 rounded-md text-sm bg-canvas-subtle text-fg-muted border border-border-default">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border-default bg-canvas-default flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="e.g. Where is the authentication logic?"
          className="flex-grow p-2 bg-canvas-subtle border border-border-default rounded-md text-sm text-fg-default placeholder-fg-subtle focus:outline-none focus:ring-2 focus:ring-accent-emphasis/50 focus:border-accent-emphasis transition-all"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-accent-emphasis hover:bg-accent-emphasis/90 text-white text-sm font-medium rounded-md disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default RepoChat;
