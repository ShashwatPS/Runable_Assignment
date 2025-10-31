import { Router } from 'express';
import { home, getAllPages, getPageById, createPage } from '../controllers/pageController.js';

const router = Router();

router.get('/', home);
router.get('/pages', getAllPages);
router.get('/pages/:id', getPageById);
router.post('/pages', createPage);

export default router;