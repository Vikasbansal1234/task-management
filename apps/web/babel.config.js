module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 'current', // Targeting the current version of Node
            },
            modules: 'commonjs' // Ensuring CommonJS modules are used for compatibility
        }],
        '@babel/preset-react' // React preset for JSX transformation
    ],
    plugins: [
        '@babel/plugin-transform-runtime' // Helps with async and generator functions
    ]
};
