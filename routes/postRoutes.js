import { Router } from 'express';
import { getPosts, getPost, createPost, deletePost, updatePost } from '../controllers/postController.js';

const router = Router();
router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', createPost);
router.delete('/:id', deletePost);
router.put('/:id', updatePost);

export default router;