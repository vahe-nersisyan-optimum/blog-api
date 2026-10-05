import * as tagRepository from '../repositories/tagRepository.js';
import { AppError } from '../errors.js';

export async function listTags() {
    return tagRepository.listTags();
}
