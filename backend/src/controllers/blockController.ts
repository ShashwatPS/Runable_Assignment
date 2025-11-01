import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const includeAllBlockTypes = {
  textBlock: true,
  headingBlock: true,
  imageBlock: true,
  codeBlock: true,
  tableBlock: true,
  webpageEmbed: true,
};

export const getBlocksByPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageId } = req.params;

    if (!pageId) {
        res.status(400).json({ error: 'Page ID is required' });
        return;
    }

    const blocks = await prisma.block.findMany({
      where: { pageId },
      orderBy: { order: 'asc' },
      include: includeAllBlockTypes,
    });

    res.status(200).json(blocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch blocks' });
  }
};

export const getBlockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Block ID is required' });
        return;
    }

    const block = await prisma.block.findUnique({
      where: { id },
      include: includeAllBlockTypes,
    });

    if (!block) {
      res.status(404).json({ error: 'Block not found' });
      return;
    }

    res.status(200).json(block);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch block' });
  }
};


export const createBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pageId } = req.params;
    const { type, ...content } = req.body; 

    if (!type) {
      res.status(400).json({ error: 'Block type is required' });
      return;
    }
    if (!pageId) {
        res.status(400).json({ error: 'Page ID is required' });
        return;
    }

    const maxOrderResult = await prisma.block.aggregate({
      _max: {
        order: true,
      },
      where: { pageId },
    });
    const newOrder = (maxOrderResult._max.order ?? -1) + 1;

    const createData: any = {
      page: { connect: { id: pageId } },
      order: newOrder,
      type: type,
    };

    switch (type) {
      case 'TEXT':
        createData.textBlock = { create: { content: content.content } };
        break;
      case 'HEADING':
        createData.headingBlock = { create: { content: content.content } };
        break;
      case 'IMAGE':
        createData.imageBlock = {
          create: { url: content.url, caption: content.caption },
        };
        break;
      case 'CODE':
        createData.codeBlock = {
          create: { code: content.code, language: content.language },
        };
        break;
      case 'TABLE':
        createData.tableBlock = { create: { data: content.data } };
        break;
      case 'WEBPAGE_EMBED':
        createData.webpageEmbed = {
          create: {
            url: content.url,
            title: content.title,
          },
        };
        break;
      default:
        res.status(400).json({ error: `Invalid block type: ${type}` });
        return;
    }

    const newBlock = await prisma.block.create({
      data: createData,
      include: includeAllBlockTypes, 
    });

    res.status(201).json(newBlock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create block' });
  }
};


export const updateBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dataToUpdate = req.body;

    if (!id) {
        res.status(400).json({ error: 'Block ID is required' });
        return;
    }

    const block = await prisma.block.findUnique({
      where: { id },
    });

    if (!block) {
      res.status(404).json({ error: 'Block not found' });
      return;
    }

    await prisma.$transaction(async (tx: any) => {
      switch (block.type) {
        case 'TEXT':
          await tx.textBlock.update({
            where: { id: block.textBlockId! },
            data: { content: dataToUpdate.content },
          });
          break;
        case 'HEADING':
          await tx.headingBlock.update({
            where: { id: block.headingBlockId! },
            data: { content: dataToUpdate.content },
          });
          break;
        case 'IMAGE':
          await tx.imageBlock.update({
            where: { id: block.imageBlockId! },
            data: { url: dataToUpdate.url, caption: dataToUpdate.caption },
          });
          break;
        case 'CODE':
          await tx.codeBlock.update({
            where: { id: block.codeBlockId! },
            data: { code: dataToUpdate.code, language: dataToUpdate.language },
          });
          break;
        case 'TABLE':
          await tx.tableBlock.update({
            where: { id: block.tableBlockId! },
            data: { data: dataToUpdate.data },
          });
          break;
        case 'WEBPAGE_EMBED':
          await tx.webpageEmbed.update({
            where: { id: block.webpageEmbedId! },
            data: {
              url: dataToUpdate.url,
              title: dataToUpdate.title,
            },
          });
          break;
        default:
          throw new Error(`Unhandled block type for update: ${block.type}`);
      }
    });

    const updatedBlock = await prisma.block.findUnique({
      where: { id },
      include: includeAllBlockTypes,
    });

    res.status(200).json(updatedBlock);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update block' });
  }
};

export const deleteBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ error: 'Block ID is required' });
        return;
    }

    const block = await prisma.block.findUnique({
      where: { id },
    });

    if (!block) {
      res.status(404).json({ error: 'Block not found' });
      return;
    }

    await prisma.$transaction(async (tx: any) => {
      switch (block.type) {
        case 'TEXT':
          if (block.textBlockId) await tx.textBlock.delete({ where: { id: block.textBlockId } });
          break;
        case 'HEADING':
          if (block.headingBlockId) await tx.headingBlock.delete({ where: { id: block.headingBlockId } });
          break;
        case 'IMAGE':
          if (block.imageBlockId) await tx.imageBlock.delete({ where: { id: block.imageBlockId } });
          break;
        case 'CODE':
          if (block.codeBlockId) await tx.codeBlock.delete({ where: { id: block.codeBlockId } });
          break;
        case 'TABLE':
          if (block.tableBlockId) await tx.tableBlock.delete({ where: { id: block.tableBlockId } });
          break;
        case 'WEBPAGE_EMBED':
          if (block.webpageEmbedId) await tx.webpageEmbed.delete({ where: { id: block.webpageEmbedId } });
          break;
        default:
          console.error(`Orphaned data may occur for unhandled block type: ${block.type}`);
      }

      await tx.block.delete({
        where: { id },
      });
    });

    res.status(204).send(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete block' });
  }
};


export const askBlock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { prompt } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Block ID is required' });
      return;
    }
    if (!prompt) {
      res.status(400).json({ error: 'A "prompt" is required in the body' });
      return;
    }

    const block = await prisma.block.findUnique({
      where: { id },
      include: includeAllBlockTypes,
    });

    if (!block) {
      res.status(404).json({ error: 'Block not found' });
      return;
    }

    const blockContent = getBlockContentAsString(block);

    if (!blockContent.trim()) {
      res.status(400).json({ error: 'Block has no text content to ask about' });
      return;
    }

    const systemPrompt = "You are an assistant that answers questions about a specific piece of content. The user will provide a question (prompt) and the content itself. Answer the user's question based *only* on the provided content.";
    const userQuery = `USER QUESTION: "${prompt}"\n\nBLOCK CONTENT:\n"""\n${blockContent}\n"""`;

    const answer = await callGeminiAPI(userQuery, systemPrompt);

    res.status(200).json({ answer });

  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        res.status(500).json({ error: 'Failed to "ask block": ' + error.message });
    } else {
        res.status(500).json({ error: 'An unknown error occurred while asking block' });
    }
  }
};


const callGeminiAPI = async (userQuery: string, systemPrompt: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY; 

  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      console.error('Gemini API error:', errorBody);
      throw new Error(`Gemini API request failed with status ${geminiResponse.status}`);
    }

    const result = await geminiResponse.json();
    const candidate = result.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('Invalid Gemini response structure:', result);
      throw new Error('Failed to parse Gemini response');
    }

    return text;
  } catch (error) {
    console.error('Error in callGeminiAPI:', error);
    throw new Error('Failed to communicate with the Gemini API.');
  }
};


const getBlockContentAsString = (block: any): string => {
  if (!block) return "";

  switch (block.type) {
    case 'TEXT':
      return block.textBlock?.content || "";
    case 'HEADING':
      return block.headingBlock?.content || "";
    case 'CODE':
      return block.codeBlock?.code || "";
    case 'TABLE':
      try {
        return JSON.stringify(block.tableBlock?.data) || "";
      } catch (e) { return ""; }
    case 'IMAGE':
      return `Image at ${block.imageBlock?.url || 'unknown URL'} (Caption: ${block.imageBlock?.caption || 'no caption'})`;
    case 'WEBPAGE_EMBED':
      return `Webpage embed of ${block.webpageEmbed?.url || 'unknown URL'} (Title: ${block.webpageEmbed?.title || 'no title'})`;
    default:
      return "";
  }
};

export const createPageWithAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'A "prompt" is required in the body' });
      return;
    }
    const systemPrompt = `
You are an AI assistant that generates structured page content for a block-based editor.
The user will provide a prompt, and you must return a JSON object with a 'title' for the page and an array of 'blocks'.
Your response MUST be a single, valid JSON object. Do not include markdown formatting like \`\`\`json ... \`\`\`.

The allowed block types are: 'HEADING', 'TEXT', 'CODE', 'TABLE', 'WEBPAGE_EMBED', 'IMAGE'.

IMPORTANT:
- For WEBPAGE_EMBED blocks, only use real, public website URLs (do NOT use localhost, internal, or private URLs).
- For IMAGE blocks, only use real image URLs from the internet (do NOT use placeholder or dummy links; use actual images relevant to the content).

Follow this JSON schema strictly:
{
  "title": "A concise and relevant title for the page",
  "blocks": [
    {
      "type": "HEADING",
      "data": { "content": "The heading text" }
    },
    {
      "type": "TEXT",
      "data": { "content": "The paragraph text." }
    },
    {
      "type": "CODE",
      "data": { "code": "console.log('Hello');", "language": "javascript" }
    },
    {
      "type": "TABLE",
      "data": { "data": [["Header 1", "Header 2"], ["Row 1 Col 1", "Row 1 Col 2"]] }
    },
    {
      "type": "WEBPAGE_EMBED",
      "data": { "url": "https://www.example.com", "title": "Optional Title" }
    },
    {
      "type": "IMAGE",
      "data": { "url": "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png", "caption": "A descriptive caption of the image." }
    }
  ]
}
`;

    const userQuery = `USER PROMPT: "${prompt}"`;

    const aiResponseString = await callGeminiAPI(userQuery, systemPrompt);

    let aiResponse: {
      title: string;

      blocks: Array<{
        type: 'HEADING' | 'TEXT' | 'CODE' | 'TABLE' | 'WEBPAGE_EMBED' | 'IMAGE';
        data: any;
      }>;
    };

    try {
      aiResponse = JSON.parse(aiResponseString);
    } catch (parseError) {
      console.error('Failed to parse AI JSON response:', aiResponseString);
      res.status(500).json({ error: 'Failed to generate page: AI returned invalid format.' });
      return;
    }

    const { title, blocks } = aiResponse;

    if (!title || !Array.isArray(blocks) || blocks.length === 0) {
      res.status(500).json({ error: 'Failed to generate page: AI returned incomplete data.' });
      return;
    }

    const newPage = await prisma.$transaction(async (tx: any) => {
      const page = await tx.page.create({
        data: { title: title },
      });

      let order = 0;
      for (const block of blocks) {
        const { type, data } = block;

        const createData: any = {
          page: { connect: { id: page.id } },
          order: order,
          type: type,
        };

        switch (type) {
          case 'TEXT':
            createData.textBlock = { create: { content: data.content } };
            break;
          case 'HEADING':
            createData.headingBlock = { create: { content: data.content } };
            break;
          case 'CODE':
            createData.codeBlock = {
              create: { code: data.code, language: data.language },
            };
            break;
          case 'TABLE':
            createData.tableBlock = { create: { data: data.data } };
            break;
          case 'WEBPAGE_EMBED':
            createData.webpageEmbed = {
              create: {
                url: data.url,
                title: data.title,
              },
            };
            break;
          case 'IMAGE':
            createData.imageBlock = {
              create: {
                url: data.url, 
                caption: data.caption,
              },
            };
            break;
          default:
            console.warn(`AI returned unhandled block type: ${type}`);
            continue; 
        }

        await tx.block.create({ data: createData });
        order++;
      }
      return page;
    });

    const fullPage = await prisma.page.findUnique({
      where: { id: newPage.id },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
          include: includeAllBlockTypes, 
        },
      },
    });

    res.status(201).json(fullPage);

  } catch (error) {
    console.error('Failed to create page with AI:', error);
    if (error instanceof Error && error.message.includes('Gemini')) {
      res.status(502).json({ error: 'Failed to communicate with the AI service: ' + error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred while creating the page' });
    }
  }
};