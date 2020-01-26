const express = require('express');
const bcrybt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
    const user = Object.assign({}, req.user.toJSON());
    delete user.password;
    console.log(user);
    return res.json(user);
});
// 회원가입
router.post('/', async (req, res, next) => {
    try {
        const exUser = await db.User.findOne({
            where: {
                userId: req.body.userId,
            },
        });
        if (exUser) {
            return res.status(403).send('이미 사용중인 아이디 입니다.');
        }
        const hashedPassword = await bcrybt.hash(req.body.password, 12);
        const newUser = await db.User.create({
            nickname: req.body.nickname,
            userId: req.body.userId,
            password: hashedPassword,
        });
        console.log(newUser);
        return res.status(200).json(newUser);
    } catch (error) {
        console.log(error);
        // return res.status(403).send(error);
        return next(error);
    }
});
// GET /user/:id
router.get('/:id', async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) },
            include: [
                {
                    model: db.Post,
                    as: 'Posts',
                    attributes: ['id'],
                },
                {
                    model: db.User,
                    as: 'Followings',
                    attributes: ['id'],
                },
                {
                    model: db.User,
                    as: 'Followers',
                    attributes: ['id', 'nickname'],
                },
            ],
            attributes: ['id', 'nickname'],
        });
        const jsonUser = user.toJSON();
        console.dir('LOAD_USER_REQUEST', jsonUser);
        jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
        jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
        jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
        res.json(user);
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('logout');
});
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            console.error(error);
            return next(error);
        }
        if (info) {
            return res.status(401).json(info.reason);
        }
        return req.login(user, async (loginError) => {
            try {
                if (loginError) {
                    return next(loginError);
                }
                const fullUser = await db.User.findOne({
                    where: { id: user.id },
                    include: [
                        {
                            model: db.Post,
                            as: 'Posts',
                            attributes: ['id'],
                        },
                        {
                            model: db.User,
                            as: 'Followings',
                            attributes: ['id'],
                        },
                        {
                            model: db.User,
                            as: 'Followers',
                            attributes: ['id'],
                        },
                    ],
                    attributes: ['id', 'nickname', 'userId'],
                });
                console.log(fullUser);
                return res.json(fullUser);
            } catch (error) {
                next(error);
            }
        });
    })(req, res, next);
});

// LOAD_FOLLOWINGS_REQUEST, GET /user/:id/followings
router.get('/:id/followings', isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) },
        });
        const followings = await user.getFollowings({
            attributes: ['id', 'nickname'],
        });
        res.json(followings);
    } catch (error) {
        console.log(error);
        next(error);
    }
});
// LOAD_FOLLOWERS_REQUEST, GET /user/:id/followers
router.get('/:id/followers', isLoggedIn, async (req, res, next) => {
    try {
        const user = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) },
        });
        const followers = await user.getFollowers({
            attributes: ['id', 'nickname'],
        });
        res.json(followers);
    } catch (error) {
        console.log(error);
        next(error);
    }
});
router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });
        await me.removeFollower(req.params.id);
        res.send(req.params.id);
    } catch (error) {
        console.log(error);
        next(error);
    }
});
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });
        await me.addFollowing(req.params.id);
        res.send(req.params.id);
    } catch (error) {
        console.log(error);
        next(error);
    }
});
router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const me = await db.User.findOne({
            where: { id: req.user.id },
        });
        await me.removeFollowing(req.params.id);
        res.send(req.params.id);
    } catch (error) {
        console.log(error);
        next(error);
    }
});
router.get('/:id/posts', async (req, res, next) => {
    try {
        const posts = await db.Post.findAll({
            where: {
                UserId: parseInt(req.params.id, 10),
            },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'nickname'],
                },
                {
                    model: db.Image,
                },
                {
                    model: db.User,
                    through: 'Like',
                    as: 'Likers',
                    attributes: ['id'],
                },
            ],
        });
        res.json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
    try {
        await db.User.update(
            {
                nickname: req.body.nickname,
            },
            {
                where: { id: req.user.id },
            },
        );
        res.send(req.body.nickname);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

module.exports = router;
