'use client';

import React, { useState, FormEvent } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import { createPageWithAI } from '../lib/helpers';
import type { Page } from '../lib/types';


interface CreateWithAIModalProps {
  onClose: () => void;
  onPageCreated: (page: Page) => void;
}

export const CreateWithAIModal: React.FC<CreateWithAIModalProps> = ({
  onClose,
  onPageCreated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const newPage = await createPageWithAI(prompt);
      onPageCreated(newPage); 
      onClose(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            <Sparkles className="w-5 h-5 inline-block mr-2 text-purple-500" />
            Create a new page with AI
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="ai-prompt-textarea"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              What do you want to make a page about?
            </label>
            <textarea
              id="ai-prompt-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., 'A simple React component for a to-do list' or 'A meeting agenda for the Q4 planning session'"
              rows={4}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md">
              <p>
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};