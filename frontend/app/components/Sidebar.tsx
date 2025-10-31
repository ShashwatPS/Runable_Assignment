'use client';

import React, { useState } from 'react';
import { ChevronsLeft, ChevronsRight, FilePlus, Loader2 } from 'lucide-react';
import type { Page } from '../lib/types';

interface SidebarProps {
  pages: Page[];
  selectedPageId: string | null;
  onSelectPage: (pageId: string) => void;
  onNewPage: () => void;
  isLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pages,
  selectedPageId,
  onSelectPage,
  onNewPage,
  isLoading,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`bg-gray-50 border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h1 className="text-lg font-semibold text-gray-800">My Pages</h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-md text-gray-500 hover:bg-gray-200"
        >
          {isCollapsed ? (
            <ChevronsRight size={20} />
          ) : (
            <ChevronsLeft size={20} />
          )}
        </button>
      </div>

      {/* Page List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        )}
        {pages.map((page) => (
          <button
            key={page.id}
            onClick={() => onSelectPage(page.id)}
            className={`w-full flex items-center p-2 rounded-md text-left ${
              selectedPageId === page.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <span className="truncate">{isCollapsed ? '📄' : page.title}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={onNewPage}
          className={`w-full flex items-center p-2 rounded-md text-gray-600 hover:bg-gray-100 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <FilePlus size={20} />
          {!isCollapsed && <span className="ml-2">New Page</span>}
        </button>
      </div>
    </div>
  );
};