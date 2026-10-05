import { pool } from '../db.js';

export async function listTags() {
    const { rows } = await pool.query(
        'SELECT id, name FROM tags ORDER BY name'
    );
    return rows;
}