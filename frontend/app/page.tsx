'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FilePlus } from 'lucide-react';

import type { Page } from './lib/types';
import { fetchPages, createNewPage } from './lib/helpers';

import { Sidebar } from './components/Sidebar';
import { PageDisplay } from './components/PageDisplay';

export default function HomePage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [isLoadingPages, setIsLoadingPages] = useState(true);

  const loadPages = useCallback(async () => {
    setIsLoadingPages(true);
    try {
      const fetchedPages = await fetchPages();
      setPages(fetchedPages);
      if (!selectedPageId && fetchedPages.length > 0) {
        setSelectedPageId(fetchedPages[0].id);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to load pages.');
    } finally {
      setIsLoadingPages(false);
    }
  }, [selectedPageId]); 

  useEffect(() => {
    loadPages();
  }, [loadPages]); 

  const handleNewPage = async () => {
    const title = window.prompt('Enter new page title:', 'Untitled');
    if (title) {
      try {
        const newPage = await createNewPage(title);
        setPages((prev) => [...prev, newPage]);
        setSelectedPageId(newPage.id);
      } catch (e) {
        alert('Error creating page: ' + (e as Error).message);
      }
    }
  };

  const handlePageCreatedWithAI = async (newPage: Page) => {
    await loadPages();
    setSelectedPageId(newPage.id);
  };

  return (
    <div className="flex h-screen w-screen bg-white">
      <Sidebar
        pages={pages}
        selectedPageId={selectedPageId}
        onSelectPage={setSelectedPageId}
        onNewPage={handleNewPage}
        isLoading={isLoadingPages}
        onPageCreatedWithAI={handlePageCreatedWithAI}
      />

      {selectedPageId ? (
        <PageDisplay key={selectedPageId} selectedPageId={selectedPageId} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <FilePlus size={64} className="mb-4" />
          <h2 className="text-xl">No page selected</h2>
          <p>Create a new page or select one from the sidebar.</p>
        </div>
      )}
    </div>
  );
}