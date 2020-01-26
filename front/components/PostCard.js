import React, { useState, useEffect, useCallback } from 'react';
import { Card, Icon, Button, Avatar, Input, Form, List, Comment } from 'antd';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import {
    ADD_COMMENT_REQUEST,
    LOAD_COMMENTS_REQUEST,
    LIKE_POST_REQUEST,
    UNLIKE_POST_REQUEST,
    RETWEET_REQUEST,
} from '../reducers/post';
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';

const PostCard = ({ post }) => {
    const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { me } = useSelector((state) => state.user);
    const { commentAdded, isAddingComment } = useSelector((state) => state.post);
    const dispatch = useDispatch();

    const liked = me && post.Likers && post.Likers.find((v) => v.id === me.id);

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

    const onSubmitComment = useCallback(
        (e) => {
            e.preventDefault();
            if (!me) {
                return alert('로그인이 필요합니다.');
            }
            dispatch({
                type: ADD_COMMENT_REQUEST,
                data: {
                    postId: post.id,
                    content: commentText,
                },
            });
        },
        [me && me.id, commentText],
    );

    useEffect(() => {
        setCommentText('');
    }, [commentAdded === true]);

    const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
    });

    const onToggleLike = useCallback(() => {
        if (!me) {
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
    }, [me && me.id, post && post.id, liked]);

    const onRetweet = useCallback(() => {
        if (!me) {
            return alert('로그인이 필요합니다.');
        }
        return dispatch({
            type: RETWEET_REQUEST,
            data: post.id,
        });
    }, [me && me.id, post.id]);

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

    return (
        <div>
            <Card
                // key={post.id}
                cover={post.Images[0] && <PostImages images={post.Images} />}
                actions={[
                    <Icon type="retweet" key="retweet" onClick={onRetweet} />,
                    <Icon
                        type="heart"
                        key="heart"
                        theme={liked ? 'twoTone' : 'outlined'}
                        twoToneColor={'orange'}
                        onClick={onToggleLike}
                    />,
                    <Icon type="message" key="message" onClick={onToggleComment} />,
                    <Icon type="ellipsis" key="ellipsis" />,
                ]}
                title={post.RetweetId ? `${post.User.nickname} 님이 리트윗 하셨습니다.` : null}
                extra={
                    !me || post.User.id === me.id ? null : me.Followings &&
                      me.Followings.find((v) => v.id === post.User.id) ? (
                        <Button onClick={onUnFollow(post.User.id)}>언팔로우</Button>
                    ) : (
                        <Button onClick={onFollow(post.User.id)}>팔로우</Button>
                    )
                }
            >
                {post.RetweetId && post.Retweet ? (
                    <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
                        <Card.Meta
                            avatar={
                                <Link
                                    href={{ pathname: '/user', query: { id: post.Retweet.User.id } }}
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
                    <Form onSubmit={onSubmitComment}>
                        <Form.Item>
                            <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={isAddingComment}>
                            삐약
                        </Button>
                    </Form>
                    <List
                        header={`${post.Comments ? post.Comments.length : 0} 댓글`}
                        itemLayout="horizontal"
                        dataSource={post.Comments || []}
                        renderItem={(item) => (
                            <li>
                                <Comment
                                    author={item.User.nickname}
                                    avatar={
                                        <Link
                                            href={{ pathname: '/user', query: { id: post.User.id } }}
                                            as={`/user/${post.User.id}`}
                                        >
                                            <a>{post.User.nickname[0]}</a>
                                        </Link>
                                    }
                                    content={item.content}
                                />
                            </li>
                        )}
                    />
                </>
            )}
        </div>
    );
};

PostCard.propTypes = {
    post: PropTypes.shape({
        User: PropTypes.object,
        content: PropTypes.string,
        img: PropTypes.string,
        createdAt: PropTypes.string,
    }),
};

export default PostCard;
