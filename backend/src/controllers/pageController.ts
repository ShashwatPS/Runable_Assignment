import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const home = (req: Request, res: Response): void => {
  res.send('Notion Editor API');
};

export const getAllPages = async (req: Request, res: Response): Promise<void> => {
  try {
    const pages = await prisma.page.findMany();
    res.json(pages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
};

export const getPageById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const page = await prisma.page.findUnique({
      where: { id },
      include: { blocks: true },
    });

    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }

    res.json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
};

export const createPage = async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  try {
    const page = await prisma.page.create({
      data: { title },
    });

    res.status(201).json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create page' });
  }
};