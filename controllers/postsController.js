const { body, validationResult } = require('express-validator');
const slugify = require('slugify');

const db = require('../db/index');
const ApiResponse = require('../utils/response');

exports.createPost = [
    body('title').not().isEmpty().trim().escape(),
    body('content').not().isEmpty().trim().escape(),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Errors:", errors);
            return res.status(401).json(new ApiResponse({ success: false, error: errors.array() }));
        }

        try {
            const slug = slugify(req.body.title, { lower: true });
            const { rows } = await db.query('INSERT INTO posts (title, content, image, slug, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *', [req.body.title, req.body.content, req.body.image, slug, req.user.user_id]);

            res.json(new ApiResponse({ data: rows }));
        } catch (e) {
            res.status(500);
        }
    }
]

exports.deletePost = async (req, res) => {
    try {
        await db.query('DELETE FROM posts WHERE post_id = $1', [req.params.post_id]);

        res.json(new ApiResponse());
    } catch (err) {
        console.log(err.message);
        return res.status(401).json(new ApiResponse({ success: false, error: 'Bad request' }));
    }
};


exports.getAllPosts = async (req, res) => {
    let { limit, offset } = req.query;

    if (!limit) {
        limit = 7;
    }

    if (!offset) {
        offset = 0;
    }

    try {
        const { rows } = await db.query(`SELECT * FROM posts ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`);

        res.json(new ApiResponse({ data: rows }));
    } catch (err) {
        console.log(err.message);
        return res.status(500).json(new ApiResponse({ success: false, error: 'Something went wrong, please try again' }));
    }
};

exports.createComment = [
    body('description').not().isEmpty().trim().escape(),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Errores", errors);
            return res.status(401).json({ 'errors': errors.array() });
        }

        try {
            const data = await db.query('SELECT user_id FROM users WHERE username = $1', [req.user.username]);

            const { rows } = await db.query('INSERT INTO comments (description, post_id, user_id) VALUES($1, $2, $3) RETURNING *', [req.body.description, req.body.post_id, data.rows[0].user_id]);

            res.json(new ApiResponse({ data: rows }));
        } catch (e) {
            res.status(500);
        }
    }
];

exports.getAllComments = async (req, res) => {
    const { rows } = await db.query('SELECT comment_id, description, username, avatar from comments C JOIN users U ON C.user_id = U.user_id WHERE C.post_id = $1', [req.params.post_id]);
    res.json(new ApiResponse({ data: rows }));
};


exports.getPost = [
    async (req, res) => {
        try {
            const { rows } = await db.query('SELECT * FROM posts WHERE post_id = $1', [req.params.id]);

            res.json(new ApiResponse({ data: rows }));
        } catch (e) {
            console.log(e.message);
        }
    }
];

