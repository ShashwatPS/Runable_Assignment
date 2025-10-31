import { Router } from 'express';
import { home, getAllPages, getPageById, createPage } from '../controllers/pageController.js';

const router = Router();

router.get('/check', home);
router.get('/', getAllPages);
router.get('/:id', getPageById);
router.post('/', createPage);

export default router;