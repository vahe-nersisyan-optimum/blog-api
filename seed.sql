INSERT INTO users (name, email) VALUES 
('John Doe', 'john.doe@example.com'),
('Jane Smith', 'jane.smith@example.com'),
('Alice Johnson', 'alice.johnson@example.com'),
('Bob Brown', 'bob.brown@example.com');

INSERT INTO posts (user_id, title, content) VALUES
(1, 'John''s First Post', 'This is the content of John''s first post.'),
(1, 'John''s Second Post', 'This is the content of John''s second post.'),
(2, 'Jane''s First Post', 'This is the content of Jane''s first post.'),
(2, 'Jane''s Second Post', 'This is the content of Jane''s second post.'),
(3, 'Alice''s First Post', 'This is the content of Alice''s first post.'),
(3, 'Alice''s Second Post', 'This is the content of Alice''s second post.');

INSERT INTO tags (name) VALUES
('Technology'),
('Programming'),
('Lifestyle'),
('Food');

INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 3),
(4, 4),
(5, 3),
(6, 2);