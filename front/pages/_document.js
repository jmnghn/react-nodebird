import React from 'react';
import Document, { Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Helmet from 'react-helmet';
import { PropTypes } from 'prop-types';
import '../styles/styles.scss';

class MyDocument extends Document {
    static async getInitialProps(context) {
        const sheet = new ServerStyleSheet();
        // const initialProps = await Document.getInitialProps(context);
        const page = context.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />));
        const styleTags = sheet.getStyleElement();
        // console.log('MyDocument page:', page);
        return { ...page, helmet: Helmet.renderStatic(), styleTags };
    }

    render() {
        const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
        const htmlAttrs = htmlAttributes.toComponent();
        const bodyAttrs = bodyAttributes.toComponent();
        return (
            <html {...htmlAttrs}>
                <head>
                    {this.props.styleTags}
                    {Object.values(helmet).map((el) => el.toComponent())}
                </head>
                <body {...bodyAttrs}>
                    <Main />
                    {process.env.NODE_ENV === 'production' && (
                        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />
                    )}
                    <NextScript />
                </body>
            </html>
        );
    }
}

MyDocument.propTypes = {
    helmet: PropTypes.object.isRequired,
    styleTags: PropTypes.object.isRequired,
};

export default MyDocument;
