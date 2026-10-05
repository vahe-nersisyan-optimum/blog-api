import * as tagService from '../services/tagService.js';

export async function getTags(req, res) {
    const tags = await tagService.listTags();
    res.status(200).json(tags);
}