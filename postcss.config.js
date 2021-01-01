// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
    plugins: [
        require('autoprefixer'),
        require('cssnano'),
        require('postcss-import'),
        require('postcss-url'),
        require('postcss-preset-env')({
            browsers: 'last 2 versions',
            stage: 0,
        }),
    ],
};
