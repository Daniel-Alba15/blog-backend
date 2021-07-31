const { body, validationResult } = require('express-validator');
const slugify = require('slugify');

const db = require('../db/index');

exports.createPost = [
    body('title').not().isEmpty().trim().escape(),
    body('content').not().isEmpty().trim().escape(),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log("Errores", errors);
            return res.status(401).json({ 'errors': errors.array() });
        }

        const slug = slugify(req.body.title, { lower: true });
        rows = await db.query('INSERT INTO posts (title, content, image, slug, user_id) VALUES($1, $2, $3, $4, $5) RETURNING *', [req.body.title, req.body.content, req.body.image, slug, req.user.user_id]);

        res.json({ 'data': rows.rows })
    }
]

exports.deletePost = async (req, res) => {
    try {
        rows = await db.query('DELETE FROM posts WHERE post_id = $1', [req.params.post_id]);

        res.json({ 'data': rows.rows })
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({ 'error': 'Bad request' });
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
        rows = await db.query(`SELECT * FROM posts ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`);

        res.json({ 'data': rows.rows })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ 'error': 'Something went wrong, please try again' });
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

        const data = await db.query('SELECT user_id FROM users WHERE username = $1', [req.user.username]);

        const { rows } = await db.query('INSERT INTO comments (description, post_id, user_id) VALUES($1, $2, $3) RETURNING *', [req.body.description, req.body.post_id, data.rows[0].user_id]);

        res.json({ 'data': rows });
    }
];

exports.getAllComments = async (req, res) => {
    console.log(req.params.post_id);
    const { rows } = await db.query('SELECT comment_id, description, username, avatar from comments C JOIN users U ON C.user_id = U.user_id WHERE C.post_id = $1', [req.params.post_id]);
    res.json({ 'data': rows });
};


exports.getPost = [
    async (req, res) => {
        const { rows } = await db.query('SELECT * FROM posts WHERE slug = $1', [req.params.slug]);

        res.json({ 'data': rows });
    }
];

