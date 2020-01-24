const express = require('express');
const bcrybt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const router = express.Router();

router.get('/', (req, res) => {});
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
router.get('/:id', (req, res) => {});
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
        return req.login(user, (loginError) => {
            if (loginError) {
                return next(loginError);
            }
            const filteredUser = Object.assign({}, user.toJSON());
            delete filteredUser.password;
            return res.json(filteredUser);
        });
    })(req, res, next);
});
router.get('/:id/follow', (req, res) => {});
router.post('/:id/follow', (req, res) => {});
router.delete('/:id/follow', (req, res) => {});
router.get('/:id/posts', (req, res) => {});

module.exports = router;
