const express = require('express');
const db = require('../models');
const router = express.Router();

router.post('/', async (req, res, next) => {
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

module.exports = router;
