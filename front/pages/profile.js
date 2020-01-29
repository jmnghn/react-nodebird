import React, { useEffect, useCallback } from 'react';
import { Button, List, Card, Icon } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import NicknameEditForm from '../components/NicknameEditForm';
import PostCard from '../components/PostCard';
import {
    LOAD_FOLLOWERS_REQUEST,
    LOAD_FOLLOWINGS_REQUEST,
    UNFOLLOW_USER_REQUEST,
    REMOVE_FOLLOWER_REQUEST,
} from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import FollowList from '../components/FollowList';

const Profile = () => {
    const dispatch = useDispatch();
    const { followingList, followerList, hasMoreFollower, hasMoreFollowing } = useSelector((state) => state.user);
    const { mainPosts } = useSelector((state) => state.post);

    // useEffect(() => {
    //     if (me) {
    //         dispatch({
    //             type: LOAD_FOLLOWERS_REQUEST,
    //             data: me.id,
    //         });
    //         dispatch({
    //             type: LOAD_FOLLOWINGS_REQUEST,
    //             data: me.id,
    //         });
    //         dispatch({
    //             type: LOAD_USER_POSTS_REQUEST,
    //             data: me.id,
    //         });
    //     }
    // }, [me && me.id]);

    const onUnFollow = useCallback(
        (userId) => () => {
            dispatch({
                type: UNFOLLOW_USER_REQUEST,
                data: userId,
            });
        },
        [],
    );

    const onRemoveFollower = useCallback(
        (userId) => () => {
            dispatch({
                type: REMOVE_FOLLOWER_REQUEST,
                data: userId,
            });
        },
        [],
    );

    const loadMoreFollowings = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWINGS_REQUEST,
            offset: followingList.length,
        });
    }, [followingList.length]);

    const loadMoreFollowers = useCallback(() => {
        dispatch({
            type: LOAD_FOLLOWERS_REQUEST,
            offset: followerList.length,
        });
    }, [followerList.length]);

    return (
        <div>
            <NicknameEditForm header="팔로잉 목록" hasMore={hasMoreFollowing} onClick={loadMoreFollowings} />
            <FollowList
                header="팔로잉 목록"
                hasMore={hasMoreFollowing}
                onClickMore={loadMoreFollowings}
                data={followingList}
                onClickStop={onUnFollow}
            />
            <FollowList
                header="팔로워 목록"
                hasMore={hasMoreFollower}
                onClickMore={loadMoreFollowers}
                data={followerList}
                onClickStop={onRemoveFollower}
            />
            <div>
                {mainPosts.map((c) => (
                    <PostCard key={c.id} post={c} />
                ))}
            </div>
        </div>
    );
};

Profile.getInitialProps = async (context) => {
    const state = context.store.getState();

    context.store.dispatch({
        type: LOAD_FOLLOWERS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
    context.store.dispatch({
        type: LOAD_FOLLOWINGS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
    context.store.dispatch({
        type: LOAD_USER_POSTS_REQUEST,
        data: state.user.me && state.user.me.id,
    });
};

export default Profile;
