module.exports = function (config) {
    config.set({
        files: [{ pattern: 'tests/dist/**/*.js', type: 'module' }],

        plugins: [require.resolve('@open-wc/karma-esm'), 'karma-*'],
        esm: {
            nodeResolve: true,
            compatibility: 'min',
            babel: true,
        },
        coverageReporter: {
            includeAllSources: true,
            dir: '.coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' },
            ],
        },
        reporters: ['progress', 'coverage'],
        frameworks: ['esm', 'mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: true,
        singleRun: true,
        concurrency: Infinity,
    });
};
