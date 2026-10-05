import * as postService from '../services/postService.js';

export async function getPosts(req, res) {
    const { tag, userId } = req.query;
    const posts = await postService.listPosts({ tag, userId });
    res.status(200).json(posts);
}

export async function getPost(req, res) {
    const post = await postService.getPost(req.params.id);
    res.status(200).json(post);
}

export async function createPost(req, res) {
    const { userId, title, content, tags } = req.body;
    const post = await postService.createPost({ userId, title, content, tags });
    res.status(201).json(post);
}

export async function deletePost(req, res) {
    await postService.deletePost(req.params.id);
    res.status(204).end();
}

export async function updatePost(req, res) {
    const { title, content, tags } = req.body;
    const post = await postService.updatePost(req.params.id, { title, content, tags });
    res.status(200).json(post);
}