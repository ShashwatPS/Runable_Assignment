'use client';

import React, { useState } from 'react';
import { Trash2, Edit, Sparkles } from 'lucide-react';
import type { Block } from '../lib/types';


interface BlockComponentProps {
  block: Block;
  onDelete: (blockId: string) => void;
  onEdit: (block: Block) => void;
  onAsk: (block: Block) => void;
}

export const BlockComponent: React.FC<BlockComponentProps> = ({
  block,
  onDelete,
  onEdit,
  onAsk,
}) => {
  const [showControls, setShowControls] = useState(false);

  const renderBlockContent = () => {
    switch (block.type) {
      case 'TEXT':
        return (
          <p className="text-gray-800 whitespace-pre-wrap">
            {block.textBlock?.content}
          </p>
        );
      case 'HEADING':
        return (
          <h1 className="text-3xl font-bold text-gray-900">
            {block.headingBlock?.content}
          </h1>
        );
      case 'IMAGE':
        return (
          <figure>
            <img
              src={block.imageBlock?.url || 'https://placehold.co/600x400'}
              alt={block.imageBlock?.caption || 'Image'}
              className="rounded-lg max-w-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
              }}
            />
            {block.imageBlock?.caption && (
              <figcaption className="text-center text-sm text-gray-500 mt-2">
                {block.imageBlock.caption}
              </figcaption>
            )}
          </figure>
        );
      case 'CODE':
        return (
          <pre className="relative bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
            <code>{block.codeBlock?.code}</code>
            <span className="absolute top-2 right-2 text-xs text-gray-400">
              {block.codeBlock?.language}
            </span>
          </pre>
        );
      case 'TABLE':
        try {
          const data = JSON.parse(block.tableBlock?.data) as string[][];
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {data[0]?.map((header, i) => (
                      <th
                        key={i}
                        className="px-4 py-2 text-left text-sm font-medium text-gray-600"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.slice(1)?.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className="px-4 py-2 text-sm text-gray-700"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        } catch (e) {
          return (
            <p className="text-red-500">
              Error parsing table data. Expected string[][].
            </p>
          );
        }
      case 'WEBPAGE_EMBED':
        return (
          <a
            href={block.webpageEmbed?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <p className="text-sm text-gray-500">{block.webpageEmbed?.url}</p>
            <p className="text-lg font-medium text-blue-600">
              {block.webpageEmbed?.title || 'Web Page'}
            </p>
          </a>
        );
      default:
        return (
          <p className="text-red-500">
            Unknown block type: {block.type}
          </p>
        );
    }
  };

  return (
    <div
      className="relative group my-2 p-2 rounded-lg"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div
        className={`absolute -top-4 right-2 z-10 flex items-center space-x-1 bg-white border border-gray-200 rounded-md shadow-sm transition-opacity duration-200 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => onAsk(block)}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
          title="Ask AI"
        >
          <Sparkles size={16} />
        </button>
        <button
          onClick={() => onEdit(block)}
          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
          title="Edit"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => onDelete(block.id)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="relative">{renderBlockContent()}</div>
    </div>
  );
};

