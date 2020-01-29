import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, Icon, Button, Avatar, Input, Form, List, Comment, Popover } from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import {
    ADD_COMMENT_REQUEST,
    LOAD_COMMENTS_REQUEST,
    LIKE_POST_REQUEST,
    UNLIKE_POST_REQUEST,
    RETWEET_REQUEST,
    REMOVE_POST_REQUEST,
} from '../reducers/post';
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';
import CommentForm from './CommentForm';
import FollowButton from './FollowButton';

const CardWrapper = styled.div`
    margin-bottom: 20px;
`;

const PostCard = memo(({ post }) => {
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const id = useSelector((state) => state.user.me && state.user.me.id);

    const dispatch = useDispatch();

    const liked = id && post.Likers && post.Likers.find((v) => v.id === id);

    const onToggleComment = useCallback(() => {
        setCommentFormOpened((prev) => !prev);
        console.log('toggle', commentFormOpened);
        if (!commentFormOpened) {
            dispatch({
                type: LOAD_COMMENTS_REQUEST,
                data: post.id,
            });
        }
    }, []);

    const onToggleLike = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.');
        }
        if (liked) {
            dispatch({
                type: UNLIKE_POST_REQUEST,
                data: post.id,
            });
        } else {
            dispatch({
                type: LIKE_POST_REQUEST,
                data: post.id,
            });
        }
    }, [id, post && post.id, liked]);

    const onRetweet = useCallback(() => {
        if (!id) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        });
    }, [id, post.id]);

    const onFollow = useCallback(
        (userId) => () => {
            dispatch({
                type: FOLLOW_USER_REQUEST,
                data: userId,
            });
        },
        [],
    );

    const onUnFollow = useCallback(
        (userId) => () => {
            dispatch({
                type: UNFOLLOW_USER_REQUEST,
                data: userId,
            });
        },
        [],
    );

    const onRemovePost = useCallback((postId) => () => {
        dispatch({
            type: REMOVE_POST_REQUEST,
            data: postId,
        });
    });

    return (
        <CardWrapper>
            <Card
                cover={
                    post.Images[0] ? (
                        <PostImages images={post.Images} />
                    ) : (
                        <img alt="example" src="http://localhost:3060/noimages.jpeg" />
                    )
                }
                actions={[
                    <Icon type="retweet" key="retweet" onClick={onRetweet} />,
                    <Icon type="heart" key="heart" theme={liked ? 'twoTone' : 'outlined'} onClick={onToggleLike} />,
                    <Icon type="message" key="message" onClick={onToggleComment} />,
                    <Popover
                        key="ellipsis"
                        content={
                            <Button.Group>
                                {id && post.UserId === id ? (
                                    <>
                                        {/* <Button>수정</Button> */}
                                        <Button type="danger" onClick={onRemovePost(post.id)}>
                                            삭제
                                        </Button>
                                    </>
                                ) : (
                                    <Button>신고</Button>
                                )}
                            </Button.Group>
                        }
                    >
                        <Icon type="ellipsis" key="ellipsis" />
                    </Popover>,
                ]}
                title={post.RetweetId ? `${post.User.nickname} 님이 리트윗 하셨습니다.` : null}
                extra={<FollowButton post={post} onFollow={onFollow} onUnFollow={onUnFollow} />}
            >
                {post.RetweetId && post.Retweet ? (
                    <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
                        <Card.Meta
                            avatar={
                                <Link
                                    href={{ pathname: '/user/', query: { id: post.Retweet.User.id } }}
                                    as={`/user/${post.Retweet.User.id}`}
                                >
                                    <a>
                                        <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                                    </a>
                                </Link>
                            }
                            title={post.Retweet.User.nickname}
                            description={<PostCardContent postData={post.Retweet.content} />} // a tag x -> Link
                        />
                    </Card>
                ) : (
                    <Card.Meta
                        avatar={
                            <Link
                                href={{ pathname: '/user', query: { id: post.User.id } }}
                                as={`/user/${post.User.id}`}
                            >
                                <a>
                                    <Avatar>{post.User.nickname[0]}</Avatar>
                                </a>
                            </Link>
                        }
                        title={post.User.nickname}
                        description={<PostCardContent postData={post.content} />} // a tag x -> Link
                    />
                )}
            </Card>
            {commentFormOpened && (
                <>
                    <CommentForm post={post} />
                    <List
                        header={`${post.Comments ? post.Comments.length : 0} 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments || []}
                        renderItem={(item) => (
                            <Comment
                                author={item.User.nickname}
                                avatar={
                                    <Link
                                        href={{ pathname: '/user', query: { id: post.User.id } }}
                                        as={`/user/${post.User.id}`}
                                    >
                                        <Avatar src={post.User.nickname[0]}>
                                            <a>{post.User.nickname[0]}</a>
                                        </Avatar>
                                    </Link>
                                }
                                content={item.content}
                            />
                        )}
                    />
                </>
            )}
        </CardWrapper>
    );
});

PostCard.propTypes = {
    post: PropTypes.shape({
        User: PropTypes.object,
        content: PropTypes.string,
        img: PropTypes.string,
        createdAt: PropTypes.string,
    }),
};

export default PostCard;
