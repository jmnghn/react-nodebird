import React, { useCallback } from 'react';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import { useInput } from '../pages/signup'; // TODO: util 폴더로 옮기기
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction, LOG_IN_REQUEST } from '../reducers/user';

const LoginError = styled.div`
    color: red;
`;

const LoginForm = () => {
    const [id, onChangeId] = useInput('');
    const [password, onChangePassword] = useInput('');
    const { isLoggingIn, logInErrorReason } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const onSubmitForm = useCallback(
        (e) => {
            e.preventDefault();
            dispatch(
                loginRequestAction({
                    userId: id,
                    password,
                }),
            );
        },
        [id, password],
    );

    return (
        <Form onSubmit={onSubmitForm} style={{ padding: '10px' }}>
            <div style={{ marginBottom: '12px' }}>
                <label htmlFor="user-id" style={{ display: 'inline-block', marginBottom: '8px' }}>
                    아이디
                </label>
                <Input name="user-id" value={id} onChange={onChangeId} required />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="user-password" style={{ display: 'inline-block', marginBottom: '8px' }}>
                    비밀번호
                </label>
                <Input name="user-password" value={password} onChange={onChangePassword} type="password" required />
            </div>
            <div>
                <Button type="primary" htmlType="submit" loading={isLoggingIn} style={{ marginRight: '12px' }}>
                    로그인
                </Button>
                <Link href="/signup">
                    <a>
                        <Button>회원가입</Button>
                    </a>
                </Link>
            </div>
        </Form>
    );
};

export default LoginForm;
