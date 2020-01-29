import { Avatar, Card, Button } from 'antd';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';

const UserProfile = () => {
    const { me } = useSelector((state) => state.user);

    return (
        <Card
            actions={[
                <Link prefetch href="/profile" key="twit">
                    <a>
                        <div>
                            남긴글
                            <br />
                            {me && me.Posts ? me.Posts.length : 0}
                        </div>
                    </a>
                </Link>,
                <Link prefetch href="/profile" key="following">
                    <a>
                        <div>
                            팔로잉
                            <br />
                            {me && me.Posts ? me.Followings.length : 0}
                        </div>
                    </a>
                </Link>,
                <Link prefetch href="/profile" key="follower">
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
        </Card>
    );
};

export default UserProfile;
