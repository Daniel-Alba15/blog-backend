const db = require('../../db/index');

const checkAdmin = async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT is_admin, user_id FROM users WHERE username = $1', [req.user.username]);

        if (!rows[0].is_admin) {
            return res.status(403).json({ 'error': 'You do not have permissions' });
        }

        req.user.user_id = rows[0].user_id;
        next();
    } catch (err) {
        return res.status(401);
    }
};

module.exports = checkAdmin;