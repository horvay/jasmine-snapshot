// Karma configuration
// Generated on Fri May 05 2017 07:55:10 GMT-0400 (EDT)

module.exports = function (config)
{
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'karma-typescript'],



    // list of files / patterns to load in the browser
    files: [
      './__tests__/example-test.test.ts',
      // './__tests__/**/*.ts',
      './src/**/*.ts'
    ],


    // list of files to exclude
    exclude: [
      "./example/*"
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "./src/**/*.ts": ["karma-typescript"], // *.tsx for React Jsx
      "./__tests__/**/*.ts": ["karma-typescript"], // *.tsx for React Jsx
    },

    karmaTypescriptConfig: {
            compilerOptions: {
                target: "es5",
                sourceMap: true,
                module: "commonjs",
                moduleResolution: "node",
                isolatedModules: false,
                jsx: "react",
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                types: ["jasmine"]
            },
            coverageOptions: {
                instrumentation: false
            }
        },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress", "karma-typescript"],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
