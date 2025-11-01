'use client';

import React, { useState, FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Block } from '../lib/types';
import { askBlockOnServer, updateBlockOnServer } from '../lib/helpers';

interface AskBlockModalProps {
  block: Block;
  onClose: () => void;
  onSave: (updatedBlock: Block) => void;
}

export const AskBlockModal: React.FC<AskBlockModalProps> = ({
  block,
  onClose,
  onSave,
}) => {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [suggestedEdit, setSuggestedEdit] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const editableBlockTypes: Block['type'][] = ['TEXT', 'HEADING', 'CODE', 'TABLE'];
  const isEditable = editableBlockTypes.includes(block.type);

  const getBlockContentForDisplay = (block: Block): string => {
    switch (block.type) {
      case 'TEXT':
        return block.textBlock?.content || '';
      case 'HEADING':
        return block.headingBlock?.content || '';
      case 'CODE':
        return block.codeBlock?.code || '';
      case 'TABLE':
        try {
          return JSON.stringify(block.tableBlock?.data || {});
        } catch (e) {
          return '{}';
        }
      default:
        return `(Content for ${block.type} block)`;
    }
  };

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsAsking(true);
    setError('');
    setAnswer('');
    setSuggestedEdit(null);
    try {
      const result = await askBlockOnServer(block.id, prompt);
      setAnswer(result.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get answer');
    } finally {
      setIsAsking(false);
    }
  };

  const handleGenerateEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsEditing(true);
    setError('');
    setAnswer('');
    setSuggestedEdit(null);

    const editPrompt = `USER REQUEST: "${prompt}"\n\nBased on the user's request, please rewrite the following content.
IMPORTANT: Respond with *only* the new, fully rewritten content and nothing else. Do not add explanations, apologies, or greetings.
${
  block.type === 'TABLE'
    ? 'The content is JSON for a table. Your response MUST be valid JSON.'
    : ''
}
\n\nCONTENT TO EDIT:\n"""\n${getBlockContentForDisplay(
      block
    )}\n"""`;

    try {
      const result = await askBlockOnServer(block.id, editPrompt);
      setSuggestedEdit(result.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get answer');
    } finally {
      setIsEditing(false);
    }
  };

  const handleApplyEdit = async () => {
    if (!suggestedEdit) return;

    setIsEditing(true);
    setError('');

    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let dataToUpdate: any;
    switch (block.type) {
      case 'TEXT':
        dataToUpdate = { content: suggestedEdit };
        break;
      case 'HEADING':
        dataToUpdate = { content: suggestedEdit };
        break;
      case 'CODE':
        dataToUpdate = {
          code: suggestedEdit,
          language: block.codeBlock?.language || 'plaintext', 
        };
        break;
      case 'TABLE':
        try {
          const parsedData = JSON.parse(suggestedEdit);
          dataToUpdate = { data: parsedData };
        } catch (e) {
          setIsEditing(false);
          setError('AI returned invalid table data (must be valid JSON).');
          return;
        }
        break;
      default:
        setIsEditing(false);
        setError('Cannot apply edit to this block type.');
        return;
    }

    try {
      const updatedBlock = await updateBlockOnServer(block.id, dataToUpdate);
      onSave(updatedBlock); 
      onClose(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply edit');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center text-black">
            Use AI for this block
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

          <form>
            <input
              placeholder="Ask a question or describe an edit..."
              disabled={isAsking || isEditing}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="w-full p-2 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-600 font-sans whitespace-pre-wrap mb-4"
            />
            <div className="w-full mt-3 grid grid-cols-2 gap-2">
              <button
                type="submit"
                onClick={handleAskQuestion}
                disabled={isAsking || !prompt.trim()}
                className="w-full px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
              >
                {isAsking &&
                  <Loader2 size={18} className="animate-spin mr-2" />
                }
                Ask
              </button>
              <button
                type="submit"
                onClick={handleGenerateEdit}
                disabled={isEditing || !prompt.trim() || !isEditable}
                className="w-full px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center justify-center"
                title={
                  !isEditable ? 'AI editing is not available for this block type' : ''
                }
              >
                {isEditing &&
                  <Loader2 size={18} className="animate-spin mr-2" />
                }
                Generate Edit
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {suggestedEdit && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Suggested Edit:
              </p>
              <div className="max-h-48 overflow-y-auto p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
                <pre className="whitespace-pre-wrap font-sans">
                  {suggestedEdit}
                </pre>
              </div>
              <button
                onClick={handleApplyEdit}
                disabled={isEditing}
                className="w-full mt-2 px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center"
              >
                {isEditing && (
                  <Loader2 size={18} className="animate-spin mr-2" />
                )}
                Apply Edit
              </button>
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
