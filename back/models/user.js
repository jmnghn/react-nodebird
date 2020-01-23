module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            nickname: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            userId: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        },
        {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );

    User.associate = (db) => {
        db.User.hasMany(db.Post, { as: 'Post' });
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers' });
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings' });
    };

    return User;
};
