const express = require('express');
const db = require('../models');
const router = express.Router();

// GET /hashtag/:tag
router.get('/:tag', async (req, res, next) => {
    try {
        let where = {};
        if (parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
                },
            };
        }
        const posts = await db.Post.findAll({
            where,
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
                {
                    model: db.User,
                    through: 'Like',
                    as: 'Likers',
                    attributes: ['id'],
                },
                {
                    model: db.Post,
                    as: 'Retweet',
                    include: [
                        {
                            model: db.User,
                            attributes: ['id', 'nickname'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit, 10),
        });
        res.json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
