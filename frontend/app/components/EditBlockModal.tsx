'use client';

import React, { useState, FormEvent } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Block } from '../lib/types';
import { updateBlockOnServer } from '../lib/helpers';


interface EditBlockModalProps {
  block: Block;
  onClose: () => void;
  onSave: (updatedBlock: Block) => void;
}

export const EditBlockModal: React.FC<EditBlockModalProps> = ({
  block,
  onClose,
  onSave,
}) => {
  const getInitialState = () => {
    switch (block.type) {
      case 'TEXT':
        return { content: block.textBlock?.content || '' };
      case 'HEADING':
        return { content: block.headingBlock?.content || '' };
      case 'IMAGE':
        return {
          url: block.imageBlock?.url || '',
          caption: block.imageBlock?.caption || '',
        };
      case 'CODE':
        return {
          code: block.codeBlock?.code || '',
          language: block.codeBlock?.language || '',
        };
      case 'TABLE':
        return {
          data: block.tableBlock?.data
            ? JSON.stringify(block.tableBlock.data, null, 2)
            : '[]',
        };
      case 'WEBPAGE_EMBED':
        return {
          url: block.webpageEmbed?.url || '',
          title: block.webpageEmbed?.title || '',
        };
      default:
        return {};
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<any>(getInitialState());
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let dataToUpdate = formData;
      if (block.type === 'TABLE') {
        try {
          dataToUpdate = { data: JSON.parse(formData.data) };
        } catch (err) {
          alert('Invalid JSON for table data.');
          setIsSaving(false);
          return;
        }
      }

      const updatedBlock = await updateBlockOnServer(block.id, dataToUpdate);
      onSave(updatedBlock);
    } catch (err) {
      alert('Error saving block: ' + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderFormFields = () => {
    switch (block.type) {
      case 'TEXT':
        return (
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full h-40 p-2 border rounded-md text-black border-gray-300"
            placeholder="Text content..."
          />
        );
      case 'HEADING':
        return (
          <input
            type="text"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-black border-gray-300"
            placeholder="Heading content..."
          />
        );
      case 'IMAGE':
        return (
          <>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2 text-black border-gray-300"
              placeholder="Image URL..."
            />
            <input
              type="text"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-black border-gray-300"
              placeholder="Image caption..."
            />
          </>
        );
      case 'CODE':
        return (
          <>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2 text-black border-gray-300"
              placeholder="Language (e.g., javascript)"
            />
            <textarea
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full h-60 p-2 border rounded-md font-mono text-sm text-black border-gray-300"
              placeholder="Code..."
            />
          </>
        );
      case 'TABLE':
        return (
          <textarea
            name="data"
            value={formData.data}
            onChange={handleChange}
            className="w-full h-60 p-2 border rounded-md font-mono text-sm text-black border-gray-300"
            placeholder="Table data as JSON string (e.g., [ [...] ])"
          />
        );
      case 'WEBPAGE_EMBED':
        return (
          <>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2 text-black border-gray-300"
              placeholder="Webpage URL..."
            />
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-black border-gray-300"
              placeholder="Webpage title..."
            />
          </>
        );
      default:
        return <p>Cannot edit this block type.</p>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-black">Edit {block.type} Block</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X size={20} color="black"/>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">{renderFormFields()}</div>
          <div className="flex justify-end p-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
            >
              {isSaving && <Loader2 size={18} className="animate-spin mr-2" />}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

