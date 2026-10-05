import * as userRepository from '../repositories/userRepository.js';
import { AppError } from '../errors.js';

export async function listUsers() {
    return userRepository.findAll();
}

export async function createUser(name, email) {
    if (!name || !name.trim()) {
        throw new AppError(400, 'Name is required');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new AppError(400, 'A valid email is required');
    }

    try {
        return await userRepository.create(name.trim(), email.trim());
    } catch (err) {
        if (err.code === '23505') {
            throw new AppError(409, 'Email already in use');
        }
        throw err;
    }
}