const path = require('path');

/** @type import('@vue/cli-service').ProjectOptions */
module.exports = {
    lintOnSave: (process.env.NODE_ENV === 'development'),

    css: {
        sourceMap: (process.env.NODE_ENV === 'development'),
        extract: (process.env.NODE_ENV === 'production'),
    },

    productionSourceMap: (process.env.NODE_ENV === 'development'),

    // ===
    // 🛠 List of node packages that should be transpiled by babel because they're written in ES6
    // By default babel-loader ignores all files inside node_modules.
    // ===
    transpileDependencies: [
        'striptags',
        'detect-indent',
        'proper-url-join',
        'query-string',
        'split-on-first',
        'vue-sticky-directive',
    ],

    configureWebpack: {
        optimization: {
            splitChunks: {
                cacheGroups: {
                    common: {
                        name: 'chunk-common',
                        test: /node_modules[\\/](vue|vue-loader|vue-router|vuex|vue-meta|core-js|@babel\/runtime|bulma|buefy|axios|webpack|setimmediate|timers-browserify|process|regenerator-runtime|tiny-cookie|js-cookie|is-buffer|dotprop|nuxt\.js)[\\/]/,
                        chunks: 'all',
                        priority: 10,
                        automaticNameDelimiter: '/',
                    },
                },
            },
        },
    },

    // https://github.com/neutrinojs/webpack-chain/tree/v4#getting-started
    chainWebpack(config) {
        // Variables
        const isProd = process.env.NODE_ENV === 'production';
        const isDev = process.env.NODE_ENV === 'development';
        // const isTest = process.env.NODE_ENV === 'test';

        // ===
        // By default CLI prefetches all async chunks
        // ===
        config.plugins.delete('prefetch-app');
        config.plugins.delete('preload-app');

        // ===
        // it can improve the speed of the first screen, it is recommended to turn on preload
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        // ===
        // config.when(!isLegacyBundle, _config => {
        //     _config.plugin('preload-app')
        //         .tap(() => [{
        //             rel: 'preload',
        //             fileBlacklist: [ /\.map$/, /hot-update\.js$/, /runtime\..*\.js$/ ],
        //             include: 'initial',
        //         }]);
        // });

        // ===
        // Increase memory limit and workers
        // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin
        // ===
        config.plugin('fork-ts-checker').tap(args => {
            args[0].memoryLimit = 2048;
            args[0].workers = 1;
            return args;
        });

        // ===
        // Change development env source map if you want.
        // The default in vue-cli is 'eval-cheap-module-source-map'.
        // https://webpack.js.org/configuration/devtool/#development
        // ===
        config.when(isDev, _config => {
            _config.devtool('eval-cheap-source-map');
        });

        // ===
        // Libraries you want to omit
        // ===
        config.externals([
            function (context, request, callback) {
                if (/moment|xlsx|canvg|pdfmake/.test(request)) {
                    return callback(null, `commonjs ${request}`);
                }
                callback();
            },
        ]);
        // config.externals(['moment', 'xlsx', 'canvg', 'pdfmake']);

        // ===
        // SVG Loader
        // ===
        config.module
            .rule('vue')
            .use('vue-svg-inline-loader')
            .loader(require.resolve('vue-svg-inline-loader'))
            .options({
                addTitle: true,
                svgo: true,
            });

        // ===
        // Set up all the aliases we use in our app.
        // ===
        config.resolve.alias
            .clear()
            .merge({
                '@': path.join(process.env.INIT_CWD || process.cwd(), 'src'),
                '~': path.join(process.env.INIT_CWD || process.cwd(), 'public'),
            })
            .set('vue$', 'vue/dist/vue.runtime.esm.js');

        // ===
        // Only enable performance hints for production builds, outside of tests.
        // ===
        config.performance.hints(isProd && !process.env.DMC_APP_TEST && 'warning');
    },

    devServer: {
        writeToDisk: true,
        overlay: {
            warnings: true,
            errors: true,
        },
    },
};
