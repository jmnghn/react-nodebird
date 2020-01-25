const express = require('express');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const hashtags = req.body.content.match(/#[^\s]+/g);
        const newPost = await db.Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map((tag) =>
                    db.Hashtag.findOrCreate({
                        where: { name: tag.slice(1).toLowerCase() },
                    }),
                ),
            );
            console.log(result);
            await newPost.addHashtags(result.map((r) => r[0]));
        }
        // const User = await newPost.getUser();
        // newPost.User = User;
        // res.json(newPost);
        const fullPost = await db.Post.findOne({
            where: { id: newPost.id },
            include: [
                {
                    model: db.User,
                },
            ],
        });
        res.json(fullPost);
    } catch (error) {
        console.error(error);
        next(e);
    }
});
router.post('/images', (req, res) => {});

// GET /post/:id/comments
router.get('/:id/comments', async (req, res, next) => {
    try {
        const post = await db.Post.findOne({
            where: { id: req.params.id },
        });
        if (!post) {
            res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const comments = await db.Comment.findAll({
            where: {
                PostId: req.params.id,
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'nickname'],
                },
            ],
        });
        return res.json(comments);
    } catch (error) {
        console.log(error);
        next(error);
    }
});
// POST /post/:id/comment
router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
    try {
        const post = await db.Post.findOne({ where: { id: req.params.id } });
        if (!post) {
            return res.status(404).send('포스트가 존재하지 않습니다.');
        }
        const newComment = await db.Comment.create({
            PostId: post.id,
            UserId: req.user.id,
            content: req.body.content,
        });
        await post.addComment(newComment.id);
        const comment = await db.Comment.findOne({
            where: {
                id: newComment.id,
            },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'nickname'],
                },
            ],
        });
        return res.json(comment);
    } catch (error) {
        console.log(error);
        return next(error);
    }
});

module.exports = router;
