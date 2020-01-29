import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Icon } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';
import { backUrl } from '../config/config';

const PostForm = () => {
    const [text, setText] = useState('');
    const { imagePaths, isAddingPost, postAdded } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const imageInput = useRef();

    useEffect(() => {
        if (postAdded) {
            setText('');
        }
    }, [postAdded]);

    const onSubmitForm = useCallback(
        (e) => {
            e.preventDefault();
            if (!text) {
                alert('게시글을 작성하세요');
                return;
            }
            const formData = new FormData();
            imagePaths.forEach((v, i) => {
                formData.append('image', v);
            });
            formData.append('content', text);
            dispatch({
                type: ADD_POST_REQUEST,
                data: formData,
            });
        },
        [text, imagePaths],
    );

    const onChangeText = useCallback((e) => {
        setText(e.target.value);
    }, []);

    const onChangeImages = useCallback((e) => {
        console.log(e.target.files);
        const imageFormData = new FormData();
        [].forEach.call(e.target.files, (f) => {
            imageFormData.append('image', f);
        });
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        });
    }, []);

    const onClickImageUpload = useCallback(() => {
        imageInput.current.click();
    }, [imageInput.current]);

    const onRemoveImage = useCallback(
        (index) => () => {
            dispatch({
                type: REMOVE_IMAGE,
                index,
            });
        },
        [],
    );

    return (
        <Form style={{ margin: '0px 0 30px' }} encType="multipart/form-data" onSubmit={onSubmitForm}>
            <Input.TextArea maxLength={140} placeholder="😉" value={text} onChange={onChangeText} />
            <div>
                <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
                <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={isAddingPost}>
                    남기기
                </Button>
            </div>
            <div>
                {imagePaths.map((v, i) => {
                    return (
                        <div key={v} style={{ display: 'inline-block', marginTop: '16px', position: 'relative' }}>
                            <img src={v} style={{ width: '124px' }} alt={v} />
                            {/* <div style={{ textAlign: 'right' }}> */}
                            <Icon
                                type="delete"
                                onClick={onRemoveImage(i)}
                                style={{
                                    position: 'absolute',
                                    right: '8px',
                                    bottom: '8px',
                                    fontSize: '21px',
                                    color: '#ea4d55',
                                }}
                            />
                            {/* <Button onClick={onRemoveImage(i)}>제거</Button> */}
                            {/* </div> */}
                        </div>
                    );
                })}
            </div>
        </Form>
    );
};

export default PostForm;
