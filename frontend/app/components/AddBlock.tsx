'use client';

import React, { useState } from 'react';
import {
  Plus,
  Image,
  Code,
  Type,
  Heading1,
  Table,
  Link,
} from 'lucide-react';
import type { BlockType } from '../lib/types';

interface AddBlockMenuProps {
  onAddBlock: (type: BlockType) => void;
}

export const AddBlockMenu: React.FC<AddBlockMenuProps> = ({ onAddBlock }) => {
  const [isOpen, setIsOpen] = useState(false);

  const blockTypes: { type: BlockType; name: string; icon: React.ReactNode }[] =
    [
      { type: 'TEXT', name: 'Text', icon: <Type size={18} /> },
      { type: 'HEADING', name: 'Heading', icon: <Heading1 size={18} /> },
      { type: 'IMAGE', name: 'Image', icon: <Image size={18} /> },
      { type: 'CODE', name: 'Code', icon: <Code size={18} /> },
      { type: 'TABLE', name: 'Table', icon: <Table size={18} /> },
      { type: 'WEBPAGE_EMBED', name: 'Web Embed', icon: <Link size={18} /> },
    ];

  return (
    <div className="relative my-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center p-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-all"
      >
        <Plus size={20} />
        <span className="ml-2">Add Block</span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          {blockTypes.map(({ type, name, icon }) => (
            <button
              key={type}
              onClick={() => {
                onAddBlock(type);
                setIsOpen(false);
              }}
              className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-100"
            >
              <span className="text-gray-500">{icon}</span>
              <span className="ml-3">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};