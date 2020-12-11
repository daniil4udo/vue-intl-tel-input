module.exports = {
    // '*.{js,jsx,vue,ts,tsx}': [ 'vue-cli-service lint', 'git add' ]
    '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
        'yarn lint:prettier --parser=json',
    ],
    'package.json': [ 'yarn lint:prettier' ],
    '*.js': [
        'yarn lint:eslint',
        // 'yarn test:unit:file' // useing PRE_PUSH hook to test all together before pushing to remote repo
    ],
    '*.ts?(x)': [
        'yarn lint:eslint',
        // 'yarn test:unit:file',
    ],
    '*.vue': [
        'yarn lint:eslint',
        'yarn lint:stylelint',
        // 'yarn test:unit:file'
    ],
    '*.scss': [ 'yarn lint:stylelint' ],
    '*.md': [
        'yarn lint:markdownlint',
        'yarn lint:prettier',
    ],
};
