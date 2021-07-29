const jwt = require('jsonwebtoken');

exports.generateWebToken = (user) => {
    console.log(user);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return token;
};

exports.validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403);
            return;
        }

        console.log("USER DEL VERIFY", user);
        req.user = user;
        next();
    });
};