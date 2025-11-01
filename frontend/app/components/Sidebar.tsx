'use client';

import React, { useState } from 'react';
import type { Page } from '../lib/types';
import { Plus, Loader2 } from 'lucide-react';
import { CreateWithAIModal } from './createWithAI';

interface SidebarProps {
  pages: Page[];
  selectedPageId: string | null;
  onSelectPage: (id: string) => void;
  onNewPage: () => Promise<void>;
  onPageCreatedWithAI: (page: Page) => void;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pages,
  selectedPageId,
  onSelectPage,
  onNewPage,
  onPageCreatedWithAI,
  isLoading,
}) => {
  const [showAICreateModal, setShowAICreateModal] = useState(false);

  return (
    <>
      <nav className="w-64 h-full bg-gray-50 p-4 border-r border-gray-200 flex flex-col">
        <h1 className="text-lg font-semibold mb-4 text-gray-800">My Pages</h1>

        <div className="flex flex-col gap-2 mb-4">
          <button
            onClick={onNewPage}
            disabled={isLoading}
            className="w-full flex items-center justify-center p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            New Page
          </button>
          <button
            onClick={() => setShowAICreateModal(true)}
            disabled={isLoading}
            className="w-full flex items-center justify-center p-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            Create with AI
          </button>
        </div>

        <ul className="space-y-1 overflow-y-auto flex-grow">
          {pages.map((page) => (
            <li key={page.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onSelectPage(page.id);
                }}
                className={`block p-2 rounded-md ${
                  selectedPageId === page.id
                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {page.title || 'Untitled'}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {showAICreateModal && (
        <CreateWithAIModal
          onClose={() => setShowAICreateModal(false)}
          onPageCreated={(page) => {
            onPageCreatedWithAI(page);
            setShowAICreateModal(false);
          }}
        />
      )}
    </>
  );
};
