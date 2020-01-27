import { Avatar, Card, Button } from 'antd';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
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
                <Link href="/profile" key="twit">
                    <a>
                        <div>
                            짹짹
                            <br />
                            {me && me.Posts ? me.Posts.length : 0}
                        </div>
                    </a>
                </Link>,
                <Link href="/profile" key="following">
                    <a>
                        <div>
                            팔로잉
                            <br />
                            {me && me.Posts ? me.Followings.length : 0}
                        </div>
                    </a>
                </Link>,
                <Link href="/profile" key="follower">
                    <a>
                        <div>
                            팔로워
                            <br />
                            {me && me.Posts ? me.Followers.length : 0}
                        </div>
                    </a>
                </Link>,
            ]}
        >
            {/* <Card> */}
            <Card.Meta avatar={<Avatar>{me.nickname[0]}</Avatar>} title={me.nickname} />
            <Button onClick={onLogout}>로그아웃</Button>
        </Card>
    );
};

export default UserProfile;
