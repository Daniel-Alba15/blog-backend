CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(100)
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
)

CREATE TABLE posts(
	post_id SERIAL PRIMARY KEY,
	title VARCHAR(50),
	content TEXT,
	slug VARCHAR(100),
	created_at DATE NOT NULL DEFAULT CURRENT_DATE,
	user_id SERIAL,
	FOREIGN KEY (user_id) REFERENCES users(users_id) ON DELETE CASCADE
)

CREATE TABLE comments(
	comment_id SERIAL PRIMARY KEY,
	description VARCHAR(200),
	created_at DATE NOT NULL DEFAULT CURRENT_DATE,
	post_id SERIAL,
	FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
	user_id SERIAL,
	FOREIGN KEY (user_id) REFERENCES users(users_id) ON DELETE CASCADE
)