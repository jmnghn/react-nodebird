import React, { useState, useCallback, useEffect } from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import styled from 'styled-components';
import { signUpRequestAction } from '../reducers/user';

const SignupError = styled.div`
    color: red;
`;

const TextInput = ({ value }) => {
    return <div>{value}</div>;
};

TextInput.propTypes = {
    value: PropTypes.string,
};

export const useInput = (initValue = null) => {
    const [value, setter] = useState(initValue);
    const handler = useCallback((e) => {
        setter(e.target.value);
    }, []);
    return [value, handler];
};

const Signup = () => {
    const [passwordCheck, setPasswordCheck] = useState('');
    const [term, setTerm] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [termError, setTermError] = useState(false);

    const [id, onChangeId] = useInput('');
    const [nick, onChangeNick] = useInput('');
    const [password, onChangePassword] = useInput('');

    const { isSigninUp, isSignedUp, me } = useSelector((state) => state.user);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isSignedUp) {
            alert('회원가입 되었습니다.🥳\n 메인페이지로 이동합니다.');
            Router.push('/');
        }
    }, [isSignedUp]);

    if (me) {
        return null;
    }

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (password !== passwordCheck) {
                return setPasswordError(true);
            }
            if (!term) {
                return setTermError(true);
            }
            dispatch(
                signUpRequestAction({
                    userId: id,
                    password,
                    nickname: nick,
                }),
            );
        },
        [id, nick, password, passwordCheck, term],
    );

    const onChangePasswordCheck = useCallback(
        (e) => {
            setPasswordError(e.target.value !== password);
            setPasswordCheck(e.target.value);
        },
        [password],
    );

    const onChangeTerm = useCallback((e) => {
        setTermError(false);
        setTerm(e.target.checked);
    }, []);

    return (
        <>
            <Form onSubmit={onSubmit} style={{ padding: 10 }}>
                <div style={{ marginBottom: '8px' }}>
                    <label htmlFor="user-id">아이디</label>
                    <Input name="user-id" style={{ marginTop: '4px' }} value={id} required onChange={onChangeId} />
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <label htmlFor="user-nick">닉네임</label>
                    <Input
                        name="user-nick"
                        style={{ marginTop: '4px' }}
                        value={nick}
                        required
                        onChange={onChangeNick}
                    />
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <label htmlFor="user-password">비밀번호</label>
                    <Input
                        name="user-password"
                        style={{ marginTop: '4px' }}
                        type="password"
                        value={password}
                        required
                        onChange={onChangePassword}
                    />
                </div>
                <div style={{ marginBottom: '8px' }}>
                    <label htmlFor="user-password-check">비밀번호체크</label>
                    <Input
                        name="user-password-check"
                        type="password"
                        value={passwordCheck}
                        required
                        onChange={onChangePasswordCheck}
                        style={{ marginTop: '4px' }}
                    />
                    {passwordError && <SignupError>비밀번호가 일치하지 않습니다.</SignupError>}
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
                        동의합니다.
                    </Checkbox>
                    {termError && <div style={{ color: 'red' }}>약관에 동의하셔야 합니다.</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" loading={isSigninUp}>
                        가입하기
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default Signup;
