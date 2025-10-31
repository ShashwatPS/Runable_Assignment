'use client';

import React, { useState, FormEvent } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import type { Block } from '../lib/types';
import { askBlockOnServer } from '../lib/helpers';

interface AskBlockModalProps {
  block: Block;
  onClose: () => void;
}

export const AskBlockModal: React.FC<AskBlockModalProps> = ({
  block,
  onClose,
}) => {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getBlockContentForDisplay = (block: Block): string => {
    switch (block.type) {
      case 'TEXT':
        return block.textBlock?.content || '';
      case 'HEADING':
        return block.headingBlock?.content || '';
      case 'CODE':
        return block.codeBlock?.code || '';
      default:
        return `(Content for ${block.type} block)`;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');
    setAnswer('');
    try {
      const result = await askBlockOnServer(block.id, prompt);
      setAnswer(result.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get answer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center text-black">
            Ask AI about this block
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={20} color="black"/>
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Content:</p>
          <div className="max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-600 mb-4">
            <pre className="whitespace-pre-wrap font-sans">
              {getBlockContentForDisplay(block)}
            </pre>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 border rounded-md text-black border-gray-300"
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="w-full mt-3 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
            >
              {isLoading && <Loader2 size={18} className="animate-spin mr-2" />}
              {isLoading ? 'Thinking...' : 'Ask'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {answer && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Answer:</p>
              <div className="max-h-48 overflow-y-auto p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                <p className="whitespace-pre-wrap">{answer}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

