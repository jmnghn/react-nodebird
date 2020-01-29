import React, { useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Col, Input, Menu, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';

const AppContent = styled.div`
    max-width: 1250px;
    margin: 0 auto;
`;

const HomeLink = styled.a`
    font-size: 32px;
    margin: 8px 8px;
    display: block;
`;

const SearchHashTag = styled(Input.Search)`
    .ant-input {
        border: 0;
    }
`;

const AppLayout = ({ children }) => {
    const { me } = useSelector((state) => state.user);

    const onSearch = (value) => {
        console.log('onSearch: ', value);
        Router.push({ pathname: '/hashtag', query: { tag: value } }, `/hashtag/${value}`);
    };

    return (
        <>
            <AppContent>
                <Row gutter={8}>
                    <Col xs={24} md={6}>
                        <Row style={{ marginBottom: '48px' }}>
                            <Link prefetch href="/">
                                <HomeLink style={{ fontSize: '32px' }}>😉</HomeLink>
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
                    </Col>
                    <Col xs={24} md={12}>
                        {children}
                    </Col>
                    <Col xs={24} md={6}>
                        <SearchHashTag placeholder="# Search" onSearch={onSearch} />
                        <Link href="">
                            <a target="_blank">Made by Jeong myeonghyeon</a>
                        </Link>
                    </Col>
                </Row>
            </AppContent>
        </>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node,
};

export default AppLayout;
