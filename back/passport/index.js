const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
    passport.serializeUser((user, done) => {
        return done(null, user.id); // 세션에 무엇을 저장할지
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.User.findOne({
                where: { id },
            });
            return done(null, user); // req.user 에 무엇을 저장할지
        } catch (error) {
            console.log(error);
            return done(error);
        }
    });

    local();
};

// 프론트 > 서버, cookie 만 보냄
// 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id 를 발견
// id 가 deserializeUser에 들어감
// req.user 로 사용자 정보가 들어감

// 요청 보낼 때 마다 deserializeUser 가 실행됨. (db 요청 비용으로 인해 실무에서는 캐싱함.)
