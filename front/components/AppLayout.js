import React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Col, Input, Menu, Row, Avatar, Popover } from 'antd';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import LogOutButton from './LogOutButton';

const SearchWrapper = styled.div`
    @media screen and (max-width: 768px) {
        width: calc(100% - 220px) !important;
    }
`;

const DisplayNoneSpan = styled.span`
    @media screen and (max-width: 768px) {
        display: none;
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
            <header
                style={{
                    position: 'fixed',
                    height: '47px',
                    width: '100%',
                    zIndex: '10',
                    backgroundColor: '#fdf9f4',
                    borderBottom: '1px solid rgba(0,0,0,0.2)',
                }}
            >
                <div style={{ maxWidth: '1250px', margin: '2px auto 0 auto', position: 'relative' }}>
                    <div>
                        <Link prefetch href="/">
                            <a style={{ fontSize: '18px', marginLeft: '12px' }}>
                                <span style={{ fontSize: '24px' }}>🕊</span>
                                <DisplayNoneSpan>ReactNodeBird</DisplayNoneSpan>
                            </a>
                        </Link>
                    </div>
                    <SearchWrapper
                        style={{
                            display: 'block',
                            position: 'absolute',
                            top: '4px',
                            width: 'calc(100% - 880px)',
                            margin: 'auto',
                            left: '0',
                            right: '0',
                        }}
                    >
                        <Input.Search placeholder="# Search" onSearch={onSearch} />
                    </SearchWrapper>
                    <div style={{ display: 'inline-block', position: 'absolute', right: '4px', top: '6px' }}>
                        {me && (
                            <Popover
                                placement="bottomRight"
                                title={`@${me.nickname}`}
                                content={
                                    <>
                                        <Link prefetch={true} href="/profile">
                                            <a>프로필 👀</a>
                                        </Link>
                                        <br />
                                        <LogOutButton />
                                    </>
                                }
                                trigger="hover"
                            >
                                <Avatar>{me.nickname[0]}</Avatar>
                            </Popover>
                        )}
                    </div>
                </div>
            </header>
            <div style={{ maxWidth: '1250px', margin: '0 auto', paddingTop: '47px' }}>
                <Row gutter={8}>
                    <Col xs={24} md={6}>
                        <div>
                            <Row style={{ marginTop: '12px' }}>{me ? <UserProfile /> : <LoginForm />}</Row>
                            {/* {me && (
                                <>
                                    <Row>
                                        <LogOutButton />
                                    </Row>
                                </>
                            )} */}
                        </div>
                    </Col>
                    <Col xs={24} md={12} style={{ marginTop: '12px' }}>
                        {children}
                    </Col>
                    <Col xs={24} md={6} style={{ paddingTop: '12px' }}>
                        <a href="https://github.com/jeongmyeonghyeon/react-nodebird">@GitHub</a>
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
