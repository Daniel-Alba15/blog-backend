require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/user', usersRouter);
app.use('/api/post', postsRouter);


module.exports = app;
