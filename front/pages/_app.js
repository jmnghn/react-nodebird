import React from 'react';
import PropTypes from 'prop-types';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootSaga from '../sagas';
import createSagaMiddleware from 'redux-saga';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import axios from 'axios';
import Helmet from 'react-helmet';
import { Container } from 'next/app';
import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import { LOAD_USER_REQUEST } from '../reducers/user';

const NodeBird = ({ Component, store, pageProps }) => {
    return (
        <Container>
            <Provider store={store}>
                <Helmet
                    title="NodeBrid"
                    htmlAttributes={{ lang: 'ko' }}
                    meta={[
                        { carset: 'UTF-8' },
                        {
                            name: 'viewport',
                            content:
                                'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
                        },
                        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
                        { name: 'description', content: 'NodeBird SNS' },
                        { property: 'og:description', content: 'NodeBird SNS' },
                        { property: 'og:title', content: 'NodeBird' },
                    ]}
                    link={[
                        {
                            rel: 'stylesheet',
                            href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css',
                        },
                        {
                            rel: 'stylesheet',
                            href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
                        },
                        {
                            rel: 'stylesheet',
                            href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
                        },
                    ]}
                />
                <AppLayout>
                    <Component {...pageProps} />
                </AppLayout>
            </Provider>
        </Container>
    );
};

NodeBird.propTypes = {
    Component: PropTypes.elementType,
    store: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};

NodeBird.getInitialProps = async (context) => {
    console.log(context);
    const { ctx, Component } = context;
    let pageProps = {};

    const state = ctx.store.getState();
    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
    if (ctx.isServer && cookie) {
        axios.defaults.headers.Cookie = cookie;
    }
    if (!state.user.me) {
        ctx.store.dispatch({
            type: LOAD_USER_REQUEST,
        });
    }

    if (Component.getInitialProps) {
        pageProps = (await Component.getInitialProps(ctx)) || {};
    }
    return { pageProps };
};

const configureStore = (initialState, options) => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [
        sagaMiddleware,
        (store) => (next) => (action) => {
            next(action);
        },
    ];
    const enhancer =
        process.env.MODE_ENV === 'production'
            ? compose(applyMiddleware(...middlewares))
            : compose(
                  applyMiddleware(...middlewares),
                  !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
                      ? window.__REDUX_DEVTOOLS_EXTENSION__()
                      : (f) => f,
              );
    const store = createStore(reducer, initialState, enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
};

export default withRedux(configureStore)(withReduxSaga(NodeBird));
