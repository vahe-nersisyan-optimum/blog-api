SELECT posts.id, posts.title, users.name AS author
FROM posts
JOIN users ON users.id = posts.user_id;

SELECT * FROM posts
WHERE user_id = 1
ORDER BY created_at DESC, id DESC;

SELECT posts.id, posts.title
FROM posts
JOIN post_tags ON post_tags.post_id = posts.id
JOIN tags ON tags.id = post_tags.tag_id
WHERE tags.name = 'Technology';

SELECT user_id, COUNT(*) AS post_count
FROM posts
GROUP BY user_id;

SELECT users.name, posts.title
FROM users
LEFT JOIN posts ON posts.user_id = users.id;

SELECT users.name, COUNT(posts.id) AS post_count
FROM users
LEFT JOIN posts ON posts.user_id = users.id
GROUP BY users.id, users.name
ORDER BY post_count DESC;

SELECT users.id, users.name
FROM users
LEFT JOIN posts ON posts.user_id = users.id
WHERE posts.id IS NULL;

UPDATE posts
SET title = 'Updated Title'
WHERE id = 1;

SELECT * FROM post_tags 
WHERE post_id = 1;

DELETE FROM posts
WHERE id = 1; 

SELECT * FROM post_tags 
WHERE post_id = 1;