import { Router } from 'express';
import { getBlocksByPage, getBlockById, createBlock, updateBlock, deleteBlock, askBlock } from '../controllers/blockController.js';

const router = Router();

router.get('/page/:pageId', getBlocksByPage);   
router.post('/page/:pageId', createBlock);      

router.get('/:id', getBlockById);               
router.put('/:id', updateBlock);           
router.delete('/:id', deleteBlock); 

router.post('/:id/ask', askBlock);

export default router;