import React from 'react';
import Document, { Main, NextScript } from 'next/document';
import Helmet from 'react-helmet';
import { PropTypes } from 'prop-types';

class MyDocument extends Document {
    static async getInitialProps(context) {
        // const initialProps = await Document.getInitialProps(context);
        const page = context.renderPage((App) => (props) => <App {...props} />);
        console.log('MyDocument page:', page);
        return { ...page, helmet: Helmet.renderStatic() };
    }

    render() {
        const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
        const htmlAttrs = htmlAttributes.toComponent();
        const bodyAttrs = bodyAttributes.toComponent();
        return (
            <html {...htmlAttrs}>
                <head>{Object.values(helmet).map((el) => el.toComponent())}</head>
                <body {...bodyAttrs}>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}

MyDocument.propTypes = {
    helmet: PropTypes.object.isRequired,
};

export default MyDocument;
