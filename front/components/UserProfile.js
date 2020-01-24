import { Avatar, Card, Button } from 'antd';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutRequestAction } from '../reducers/user';

const UserProfile = () => {
    const { me } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const onLogout = useCallback(() => {
        dispatch(logoutRequestAction);
    }, []);
    return (
        <Card
            actions={[
                <div key="twit">
                    짹짹
                    <br />
                    {me && me.Posts ? me.Posts.length : 0}
                </div>,
                <div key="following">
                    팔로잉
                    <br />
                    {me && me.Posts ? me.Followings.length : 0}
                </div>,
                <div key="follower">
                    팔로워
                    <br />
                    {me && me.Posts ? me.Followers.length : 0}
                </div>,
            ]}
        >
            {/* <Card> */}
            <Card.Meta avatar={<Avatar>{me.nickname[0]}</Avatar>} title={me.nickname} />
            <Button onClick={onLogout}>로그아웃</Button>
        </Card>
    );
};

export default UserProfile;
