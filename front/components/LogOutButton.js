import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import { logoutRequestAction } from '../reducers/user';

const LogOutButton = () => {
    const dispatch = useDispatch();

    const onLogout = useCallback(() => {
        dispatch(logoutRequestAction);
    }, []);

    return (
        <>
            <a onClick={onLogout} style={{ fontSize: '24px' }}>
                로그아웃 👋🏻
            </a>
        </>
    );
};

export default LogOutButton;
