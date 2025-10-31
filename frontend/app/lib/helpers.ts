import type { Page, Block, BlockType } from './types';


export const fetchPages = async (): Promise<Page[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/page`);
  if (!res.ok) throw new Error('Failed to fetch pages');
  return res.json();
};

export const createNewPage = async (title: string): Promise<Page> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/page`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to create page');
  return res.json();
};

export const fetchBlocksForPage = async (pageId: string): Promise<Block[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/block/page/${pageId}`);
  if (!res.ok) throw new Error('Failed to fetch blocks');
  return res.json();
};

export const createNewBlock = async (
  pageId: string,
  type: BlockType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
): Promise<Block> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/block/page/${pageId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...content }),
  });
  if (!res.ok) throw new Error('Failed to create block');
  return res.json();
};

export const updateBlockOnServer = async (
  blockId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataToUpdate: any
): Promise<Block> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/block/${blockId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToUpdate),
  });
  if (!res.ok) throw new Error('Failed to update block');
  return res.json();
};

export const deleteBlockOnServer = async (blockId: string): Promise<void> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/block/${blockId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete block');
};

export const askBlockOnServer = async (
  blockId: string,
  prompt: string
): Promise<{ answer: string }> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/block/${blockId}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error('Failed to ask block');
  return res.json();
};
