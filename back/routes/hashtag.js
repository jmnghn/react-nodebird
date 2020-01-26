const express = require('express');
const db = require('../models');
const router = express.Router();

// GET /hashtag/:tag
router.get('/:tag', async (req, res, next) => {
    try {
        const posts = await db.Post.findAll({
            include: [
                {
                    model: db.Hashtag,
                    where: {
                        name: decodeURIComponent(req.params.tag),
                    },
                },
                {
                    model: db.User,
                },
                {
                    model: db.Image,
                },
            ],
        });
        res.json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
