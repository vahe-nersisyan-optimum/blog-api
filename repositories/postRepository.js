import { pool } from '../db.js';

const SELECT_POSTS = `
  SELECT posts.id, posts.title, posts.content, posts.created_at,
         posts.user_id, users.name AS author,
         COALESCE(
           array_agg(tags.name ORDER BY tags.name)
             FILTER (WHERE tags.name IS NOT NULL),
           '{}'
         ) AS tags
  FROM posts
  JOIN users ON users.id = posts.user_id
  LEFT JOIN post_tags ON post_tags.post_id = posts.id
  LEFT JOIN tags ON tags.id = post_tags.tag_id
`;

const GROUP_AND_ORDER = `
  GROUP BY posts.id, users.name
  ORDER BY posts.created_at DESC, posts.id DESC
`;

export async function findAll({ tag, userId }) {
  const conditions = [];
  const params = [];

  if (userId) {
    params.push(userId);
    conditions.push(`posts.user_id = $${params.length}`);
  }
  if (tag) {
    params.push(tag);
    conditions.push(`posts.id IN (
      SELECT post_tags.post_id
      FROM post_tags
      JOIN tags ON tags.id = post_tags.tag_id
      WHERE tags.name = $${params.length}
    )`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `${SELECT_POSTS} ${where} ${GROUP_AND_ORDER}`,
    params
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `${SELECT_POSTS} WHERE posts.id = $1 ${GROUP_AND_ORDER}`,
    [id]
  );
  return rows[0];
}

export async function create({ userId, title, content, tags }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING id',
      [userId, title, content]
    );
    const postId = rows[0].id;

    await attachTags(client, postId, tags);

    await client.query('COMMIT');
    return postId;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

async function attachTags(client, postId, tagNames) {
  for (const name of tagNames) {
    const { rows } = await client.query(
      `INSERT INTO tags (name) VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [name]
    );
    await client.query(
      `INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [postId, rows[0].id]
    );
  }
}

export async function deletePost(id) {
  const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
  return rowCount;
}

export async function updatePost(id, { title, content, tags }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rowCount } = await client.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3',
      [title, content, id]
    );
    if (rowCount === 0) {
      await client.query('ROLLBACK');
      return false;
    }

    await client.query('DELETE FROM post_tags WHERE post_id = $1', [id]);
    await attachTags(client, id, tags);

    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}