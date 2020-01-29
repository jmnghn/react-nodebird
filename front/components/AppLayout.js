import React, { useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Col, Input, Menu, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

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
                            <Row style={{ marginBottom: '48px' }}>
                                <Link prefetch href="/">
                                    <a style={{ fontSize: '32px', margin: '8px 8px', display: 'block' }}>😉</a>
                                </Link>
                            </Row>
                            <Row>{me ? <UserProfile /> : <LoginForm />}</Row>
                            {me && (
                                <Row>
                                    <Link prefetch href="/profile">
                                        <a>프로필</a>
                                    </Link>
                                </Row>
                            )}
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
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
