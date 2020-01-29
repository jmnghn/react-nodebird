import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
    const [commentText, setCommentText] = useState('');
    const { commentAdded, isAddingComment } = useSelector((state) => state.post);
    const { me } = useSelector((state) => state.user);
    const dispatch = useDispatch();

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

    return (
        <Form onSubmit={onSubmitComment}>
            <Form.Item style={{'marginBottom': '8px'}}>
                <Input.TextArea rows={4} value={commentText} onChange={onChangeCommentText} placeholder="✍🏻" />
            </Form.Item>
            <div style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" loading={isAddingComment}>
                    남기기
                </Button>
            </div>
        </Form>
    );
};

export default CommentForm;
