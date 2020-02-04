const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const passport = require('passport');
const hpp = require('hpp');
const helmet = require('helmet');
const RedisStore = require('connect-redis')(expressSession);

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');

const prod = process.env.NODE_ENV === 'production';
const app = express();
db.sequelize.sync();
passportConfig();

if (prod) {
    app.use(hpp());
    app.use(helmet());
    app.use(morgan('combined'));
    app.use(
        cors({
            origin: 'http://jngmnghn.com',
            credentials: true,
        }),
    );
} else {
    app.use(morgan('dev'));
    app.use(
        cors({
            origin: true,
            credentials: true,
        }),
    );
}

app.use(morgan('dev'));
app.use('/', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);
app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(
//     expressSession({
//         resave: false,
//         saveUninitialized: false,
//         secret: process.env.COOKIE_SECRET,
//         cookie: {
//             httpOnly: true,
//             secure: false, // https를 쓸 때 true
//             domain: prod && '.jngmnghn.com',
//         },
//         name: 'ngh',
//     }),
// );
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false, // https를 쓸 때 true
        domain: prod && '.jngmnghn.com',
    },
    name: 'ngh',
    store: new RedisStore({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        pass: process.env.REDIS_PASSWORD,
        logErrors: true,
    }),
};
app.use(expressSession(sessionOption));
app.use(passport.initialize()); // session 에 의존도가 있어서 그 하단에서 실행해줘야 한다.
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('ReactNodeBird back running !!!');
});

// ROUTERS
app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

app.listen(prod ? process.env.PORT : 3065, () => {
    console.log(`server is running on ${process.env.PORT}`);
});
