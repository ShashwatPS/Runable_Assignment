export interface Page {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface TextBlock {
  id: string;
  content: string;
}
export interface HeadingBlock {
  id: string;
  content: string;
}
export interface ImageBlock {
  id: string;
  url: string;
  caption: string;
}
export interface CodeBlock {
  id: string;
  code: string;
  language: string;
}
export interface TableBlock {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; 
}
export interface WebpageEmbed {
  id: string;
  url: string;
  title: string;
}

export type BlockType =
  | 'TEXT'
  | 'HEADING'
  | 'IMAGE'
  | 'CODE'
  | 'TABLE'
  | 'WEBPAGE_EMBED';

export interface Block {
  id: string;
  pageId: string;
  type: BlockType;
  order: number;
  createdAt: string;
  updatedAt: string;

  textBlock: TextBlock | null;
  headingBlock: HeadingBlock | null;
  imageBlock: ImageBlock | null;
  codeBlock: CodeBlock | null;
  tableBlock: TableBlock | null;
  webpageEmbed: WebpageEmbed | null;
}
