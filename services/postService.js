import * as postRepository from '../repositories/postRepository.js';
import { AppError } from '../errors.js';

function isWholeNumber(value) {
    return Number.isInteger(Number(value)) && Number(value) > 0;
}

export async function listPosts({ tag, userId }) {
    if (userId !== undefined && !isWholeNumber(userId)) {
        throw new AppError(400, 'userId must be a positive whole number');
    }
    return postRepository.findAll({ tag, userId });
}

export async function getPost(id) {
    if (!isWholeNumber(id)) {
        throw new AppError(400, 'Post id must be a positive whole number');
    }
    const post = await postRepository.findById(id);
    if (!post) {
        throw new AppError(404, 'Post not found');
    }
    return post;
}

export async function createPost({ userId, title, content, tags = [] }) {
    if (!isWholeNumber(userId)) {
        throw new AppError(400, 'userId must be a positive whole number');
    }
    if (typeof title !== 'string' || !title.trim()) {
        throw new AppError(400, 'Title is required');
    }
    if (typeof content !== 'string' || !content.trim()) {
        throw new AppError(400, 'Content is required');
    }
    if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
        throw new AppError(400, 'Tags must be an array of non-empty strings');
    }

    const uniqueTags = [...new Set(tags.map(tag => tag.trim()))];

    let postId;
    try {
        postId = await postRepository.create({
            userId,
            title: title.trim(),
            content: content.trim(),
            tags: uniqueTags,
        });
    } catch (err) {
        if (err.code === '23503') {
            throw new AppError(400, 'User does not exist');
        }
        throw err;
    }

    return postRepository.findById(postId);
}

export async function deletePost(id) {
    if (!isWholeNumber(id)) {
        throw new AppError(400, 'Post id must be a positive whole number');
    }
    const deleted = await postRepository.deletePost(id);
    if (!deleted) {
        throw new AppError(404, 'Post not found');
    }
}

export async function updatePost(id, { title, content, tags }) {
    if (!isWholeNumber(id)) {
        throw new AppError(400, 'Post id must be a positive whole number');
    }
    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
        throw new AppError(400, 'Title must be a non-empty string');
    }
    if (content !== undefined && (typeof content !== 'string' || !content.trim())) {
        throw new AppError(400, 'Content must be a non-empty string');
    }
    if (tags !== undefined && (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string' || !tag.trim()))) {
        throw new AppError(400, 'Tags must be an array of non-empty strings');
    }

    const uniqueTags = tags ? [...new Set(tags.map(tag => tag.trim()))] : undefined;

    const updatedPost = await postRepository.updatePost(id, {
        title: title?.trim(),
        content: content?.trim(),
        tags: uniqueTags,
    });

    if (!updatedPost) {
        throw new AppError(404, 'Post not found');
    }

    return updatedPost;
}