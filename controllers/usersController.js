const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const db = require('../db/index');
const jwt = require('../middlewares/auth/jsonWebToken');
const getAvatar = require('../utils/avatar');

exports.signup = [
    body('username').not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim().escape().isLength({ min: 8 }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 'erros': errors.array() });
        }

        try {
            const avatar = await getAvatar.getAvatar();
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const { rows } = await db.query('INSERT INTO users(username, password, avatar) VALUES($1, $2, $3) RETURNING user_id, username', [req.body.username, hashedPassword, avatar]);

            res.json({ 'data': rows });
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ 'error': err });
        }
    }
];

exports.login = [
    body('username').not().isEmpty().trim().escape(),
    body('password').not().isEmpty().trim().escape().isLength({ min: 8 }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 'erros': errors.array() });
        }

        try {
            const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
            if (rows.length < 1) {
                return res.status(401).json({ 'error': 'Incorrect data' });
            }

            const passwordMatches = await bcrypt.compare(req.body.password, rows[0].password);

            if (!passwordMatches) {
                return res.status(401).json({ 'error': 'Incorrect password' });
            }

            const token = jwt.generateWebToken({ 'username': rows[0].username });
            const { users_id, username, is_active, avatar } = rows[0];

            res.json({ user: { users_id, username, is_active }, token, avatar });
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ 'error': err });
        }
    }
];