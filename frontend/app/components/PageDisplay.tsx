'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

import type { Block, BlockType } from '../lib/types';
import {
  fetchBlocksForPage,
  createNewBlock,
  deleteBlockOnServer,
} from '../lib/helpers';

import { BlockComponent } from './Block';
import { AddBlockMenu } from './AddBlock';
import { EditBlockModal } from './EditBlockModal';
import { AskBlockModal } from './AskBlockModal';


interface PageDisplayProps {
  selectedPageId: string;
}

export const PageDisplay: React.FC<PageDisplayProps> = ({ selectedPageId }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [askingBlock, setAskingBlock] = useState<Block | null>(null);

  const loadBlocks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedBlocks = await fetchBlocksForPage(selectedPageId);
      setBlocks(fetchedBlocks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedPageId]);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  const handleAddBlock = async (type: BlockType) => {
    let defaultContent = {};
    switch (type) {
      case 'TEXT':
        defaultContent = { content: 'New text block...' };
        break;
      case 'HEADING':
        defaultContent = { content: 'New Heading' };
        break;
      case 'IMAGE':
        defaultContent = {
          url: 'https://placehold.co/600x400',
          caption: 'New image caption',
        };
        break;
      case 'CODE':
        defaultContent = {
          code: 'console.log("Hello");',
          language: 'javascript',
        };
        break;
      case 'TABLE':
        defaultContent = {
          data: JSON.stringify([
            ['Header 1', 'Header 2'],
            ['Row 1 Cell 1', 'Row 1 Cell 2'],
          ]),
        };
        break;
      case 'WEBPAGE_EMBED':
        defaultContent = {
          url: 'https://google.com',
          title: 'Google',
        };
        break;
    }

    try {
      const newBlock = await createNewBlock(selectedPageId, type, defaultContent);
      setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
    } catch (e) {
      alert('Error creating block: ' + (e as Error).message);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      try {
        await deleteBlockOnServer(blockId);
        setBlocks((prevBlocks) =>
          prevBlocks.filter((block) => block.id !== blockId)
        );
      } catch (e) {
        alert('Error deleting block: ' + (e as Error).message);
      }
    }
  };

  const handleUpdateBlock = (updatedBlock: Block) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
    setEditingBlock(null);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {blocks.map((block) => (
          <BlockComponent
            key={block.id}
            block={block}
            onDelete={handleDeleteBlock}
            onEdit={setEditingBlock}
            onAsk={setAskingBlock}
          />
        ))}

        <AddBlockMenu onAddBlock={handleAddBlock} />
      </div>

      {editingBlock && (
        <EditBlockModal
          block={editingBlock}
          onClose={() => setEditingBlock(null)}
          onSave={handleUpdateBlock}
        />
      )}
      {askingBlock && (
        <AskBlockModal
          block={askingBlock}
          onClose={() => setAskingBlock(null)}
          onSave={handleUpdateBlock}
        />
      )}
    </main>
  );
};
