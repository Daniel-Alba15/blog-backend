const express = require('express');
const router = express.Router();

const postsController = require('../controllers/postsController');
const jwt = require('../middlewares/auth/jsonWebToken');
const isAdmin = require('../middlewares/auth/isAdmin');


router.post('/create', jwt.validateToken, isAdmin, postsController.createPost);
router.post('/delete/:id', jwt.validateToken, isAdmin, postsController.deletePost);
router.get('/all', postsController.getAllPosts);
router.get('/:slug', postsController.getPost);
router.post('/comment/create', jwt.validateToken, postsController.createComment);
router.get('/comment/:post_id', postsController.getAllComments);


module.exports = router;
