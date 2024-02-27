-- Inserting records into the 'Posts' table
INSERT INTO posts (post_id, text, likes, dislikes) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'This is the first post', 0, 0),
('123e4567-e89b-12d3-a456-426614174001', 'This is the second post', 0, 0),
('123e4567-e89b-12d3-a456-426614174002', 'This is the third post', 0, 0);

-- Inserting records into the 'Comments' table
INSERT INTO comments (comment_id, text, likes, dislikes, post_id) VALUES
('123e4567-e89b-12d3-a456-426614174003', 'First comment on first post', 0, 0, '123e4567-e89b-12d3-a456-426614174000'),
('123e4567-e89b-12d3-a456-426614174004', 'Second comment on first post', 0, 0, '123e4567-e89b-12d3-a456-426614174000'),
('123e4567-e89b-12d3-a456-426614174005', 'First comment on second post', 0, 0, '123e4567-e89b-12d3-a456-426614174001');

-- Inserting records into the 'Replies' table
INSERT INTO replies (reply_id, text, likes, dislikes, comment_id) VALUES
('123e4567-e89b-12d3-a456-426614174006', 'First reply to first comment', 0, 0, '123e4567-e89b-12d3-a456-426614174003'),
('123e4567-e89b-12d3-a456-426614174007', 'Second reply to first comment', 0, 0, '123e4567-e89b-12d3-a456-426614174003'),
('123e4567-e89b-12d3-a456-426614174008', 'First reply to second comment', 0, 0, '123e4567-e89b-12d3-a456-426614174004');
