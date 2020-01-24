import React from 'react';
import Head from 'next/head';
import AppLayout from '../components/AppLayout';
import PropTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import { Provider } from 'react-redux';
import reducer from '../reducers';
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

const NodeBird = ({ Component, store, pageProps }) => {
    return (
        <Provider store={store}>
            <Head>
                <title>NodeBird</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.25.3/antd.css" />
            </Head>
            <AppLayout>
                <Component {...pageProps} />
            </AppLayout>
        </Provider>
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
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
};

const configureStore = (initialState, options) => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
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
    sagaMiddleware.run(rootSaga);
    return store;
};

export default withRedux(configureStore)(NodeBird);
