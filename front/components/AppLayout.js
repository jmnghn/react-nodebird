import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Col, Input, Menu, Row } from 'antd';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import LogOutButton from './LogOutButton';

const AppLayout = ({ children }) => {
    const { me } = useSelector((state) => state.user);

    const onSearch = (value) => {
        console.log('onSearch: ', value);
        Router.push({ pathname: '/hashtag', query: { tag: value } }, `/hashtag/${value}`);
    };

    return (
        <>
            <div style={{ maxWidth: '1250px', margin: '0 auto' }}>
                <Row gutter={8}>
                    <Col xs={24} md={6}>
                        <div>
                            <Row style={{ marginBottom: '66px' }}>
                                <Link prefetch href="/">
                                    <a style={{ fontSize: '32px', margin: '8px 8px', display: 'block' }}>😉</a>
                                </Link>
                            </Row>
                            <Row style={{ marginBottom: '32px' }}>{me ? <UserProfile /> : <LoginForm />}</Row>
                            {me && (
                                <>
                                    <Row style={{ marginTop: '100px', marginBottom: '16px' }}>
                                        <Link prefetch href="/profile">
                                            <a style={{ fontSize: '24px' }}>프로필 👀</a>
                                        </Link>
                                    </Row>
                                    <Row>
                                        <LogOutButton />
                                    </Row>
                                </>
                            )}
                        </div>
                    </Col>
                    <Col xs={24} md={12} style={{ marginTop: '12px' }}>
                        {children}
                    </Col>
                    <Col xs={24} md={6}>
                        <Input.Search placeholder="# Search" onSearch={onSearch} style={{ marginTop: '12px' }} />
                        {/* <Link href="">
                                <a target="_blank">Made by Jeong myeonghyeon</a>
                            </Link> */}
                    </Col>
                </Row>
            </div>
        </>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node,
};

export default AppLayout;
