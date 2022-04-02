module.exports = {
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/max-attributes-per-line': ['error', {
            'singleline': {
                'max': 4,
            },
            'multiline': {
                'max': 4,
            }
        }],
        'vue/html-closing-bracket-newline': ['error', {
            'singleline': 'never',
            'multiline': 'never'
        }],
        'new-cap': 'off',
        'camelcase': 'off',
        'vue/no-multi-spaces': 'off',
        'vue/multi-word-component-names': 'off',
    },

    root: true,

    env: {
        node: true
    },

    extends: [
        'plugin:vue/base',
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-strongly-recommended',
        'eslint:recommended'
    ],

    parser: "vue-eslint-parser"
}