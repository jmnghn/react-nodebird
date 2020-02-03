const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const CompressionPlugin = require('compression-webpack-plugin');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');

module.exports = withCSS(
    withSass(
        withBundleAnalyzer({
            distDir: '.next',
            webpack(config) {
                const prod = process.env.NODE_ENV === 'production';
                const plugins = [...config.plugins];
                if (prod) {
                    plugins.push(new CompressionPlugin());
                }
                config.module.rules.push({
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 100000,
                        },
                    },
                });
                return {
                    ...config,
                    mode: prod ? 'production' : 'development',
                    devtool: prod ? 'hidden-source-map' : 'eval',
                    plugins,
                };
            },
        }),
    ),
);
