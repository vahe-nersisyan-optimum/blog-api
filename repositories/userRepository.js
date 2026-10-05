import { pool } from '../db.js';

export async function findAll() {
    const { rows } = await pool.query(
        'SELECT id, name, email, created_at FROM users ORDER BY id'
    );
    return rows;
}

export async function create(name, email) {
    const { rows } = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
    );
    return rows[0];
}