var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var rimraf      = require('gulp-rimraf');
var env         = require('gulp-env');
var runSequence = require('run-sequence');
var git         = require('git-rev');
var gutil       = require('gulp-util');
var nodemon     = require('gulp-nodemon');
var fs          = require('fs');
var coveralls   = require('gulp-coveralls');
var istanbul    = require('gulp-istanbul');
var isparta     = require('isparta');
var mocha       = require('gulp-mocha');
require('shelljs/global');

//
// gulp.task('default', function(){
//     runSequence('version', 'serve');
// });

// gulp.task('serve', function () {
//     var nodeArgs = process.env.NODEMON_NODEARGS && process.env.NODEMON_NODEARGS.split(';');
//
//     nodemon({
//         script: './server/index.js',
//         watch: ['./'],
//         ext: 'html js',
//         nodeArgs: nodeArgs || undefined,
//         ignore: ['./node_modules']
//     })
//         .on('restart', function () {
//             gutil.log('restarted!');
//         });
// });
//
//
// gulp.task('version', function () {
//
//     git.short(function (commit) {
//         git.branch(function (branch) {
//
//             var metadata = {
//                 version: require('./package.json').version,
//                 revision: [null, branch, null, commit, null],
//                 date: gutil.date('ddd mmm d yyyy hh:mm:ss TT Z')
//             };
//
//             require('fs').writeFileSync('server/version.json', JSON.stringify(metadata));
//         });
//     });
//
// });
//
// gulp.task('no.onlys', function (callback) {
//     exec('find . -path "*/*.spec.js" -type f -exec grep -l "describe.only" {} + \n find . -path "*/*.spec.js" -type f -exec grep -l "it.only" {} +', function(code, output){ // jshint ignore:line
//         if (output) return callback(new Error("The following files contain .only in their tests"));
//         return callback();
//     });
// });
//
//
// gulp.task('lint', ['clean'], function () {
//     return gulp.src(['**/*.js', '!**/node_modules/**', '!**/server/migration/**', '!coverage/**/*.js'])
//         .pipe(jshint({lookup: true}))
//         .pipe(jshint.reporter('default'))
//         .pipe(jshint.reporter('fail'));
// });
//
// gulp.task('set_unit_env_vars', function () {
//     // var GITHUBTESTTOKEN = process.env.GITHUBTESTTOKEN;
//     // if (!GITHUBTESTTOKEN){
//     //     throw new Error("github test access token must be provided in GITHUBTESTTOKEN env var");
//     // }
//     env({
//         vars: {
//             GITHUBTESTTOKEN: GITHUBTESTTOKEN,
//             NODE_ENV: "test",
//             TEST_MONGO_URI: process.env.TEST_MONGO_URI || "192.168.99.100:27017/unit_test",
//             MAIL_CHIMP_KEY: "e58cff2e15d5b14514f5605e3da938be-us9"
//         }
//     });
// });

gulp.task('unit_pre', function () {
    return gulp.src(['**/*.js', '!**/*.spec.js', '!**/node_modules/**/*.js', '!.debug/**/*.js', '!gulpfile.js', '!coverage/**/*.js', '!server/migration/**/*.js'])
        .pipe(istanbul({ // Covering files
            instrumenter: isparta.Instrumenter,
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function () {
            gulp.src(['**/*.unit.spec.js', '!**/node_modules/**/*.js'], {read: false})
                .pipe(mocha({reporter: 'spec', timeout: '10000'}))
                .pipe(istanbul.writeReports({
                    reporters: ['lcov'],
                    reportOpts: {dir: 'coverage'}
                }))
                .once('end', function () {
                    process.exit();
                });
        });
});



gulp.task('set_integ_env_vars', function () {
    var GITHUBTESTTOKEN = process.env.GITHUBTESTTOKEN;
   // / if (!GITHUBTESTTOKEN){
   //      throw new Error("github test access token must be provided in GITHUBTESTTOKEN env var");
   //  }
    env({
        vars: {
            GITHUBTESTTOKEN: GITHUBTESTTOKEN,
            NODE_ENV: "test",
            TEST_MONGO_URI: process.env.TEST_MONGO_URI || "192.168.99.100:27017/integ_test"
        }
    });
});
//
// gulp.task('integ_pre', function () {
//     return gulp.src(['**/*.integ.spec.js', '!**/node_modules/**/*.js'], {read: false})
//         .pipe(mocha({reporter: 'spec', timeout: '10000'}))
//         .once('end', function () {
//             process.exit();
//         });
// });
//
//
// gulp.task('set_e2e_env_vars', function () {
//     var TEST_URL = process.env.TEST_URL;
//     var SWAGGER_URL = process.env.SWAGGER_URL;
//     var TEST_MONGO_URI = process.env.TEST_MONGO_URI;
//     var NODE_ENV = process.env.NODE_ENV;
//     var GITHUBTESTTOKEN = process.env.GITHUBTESTTOKEN;
//     if (!GITHUBTESTTOKEN){
//         throw new Error("github test access token must be provided in GITHUBTESTTOKEN env var");
//     }
//     env({
//         vars: {
//             TEST_URL: TEST_URL,
//             SWAGGER_URL: SWAGGER_URL,
//             TEST_MONGO_URI: TEST_MONGO_URI,
//             NODE_ENV: NODE_ENV,
//             GITHUBTESTTOKEN: GITHUBTESTTOKEN
//         }
//     });
// });
//
// gulp.task('e2e_pre', function () {
//     return gulp.src(['*/**/*.e2e.spec.js', '!**/node_modules/**/*.js'], {read: false})
//         .pipe(mocha({reporter: 'spec', timeout: '10000'}))
//         .once('end', function () {
//             process.exit();
//         });
// });
//
// gulp.task('e2e_extended_pre', function () {
//     return gulp.src(['*/**/*.e2e.extended.spec.js', '!**/node_modules/**/*.js'], {read: false})
//         .pipe(mocha({reporter: 'spec', timeout: '10000'}))
//         .once('end', function () {
//             process.exit();
//         });
// });
//
//
// gulp.task('clean', function () {
//     return gulp.src(['.coverdata', '.debug', '.coverrun'], {read: false})
//         .pipe(rimraf());
// });
//
//
//
gulp.task('unit_test', function(callback) {
    runSequence('unit_pre',callback);
});
//
// gulp.task('integ_test', function(callback) {
//     runSequence('set_integ_env_vars',
//         'integ_pre',
//         callback);
// });
//
// gulp.task('e2e_test', function(callback) {
//     runSequence('set_e2e_env_vars',
//         'e2e_pre',
//         callback);
// });
//
// gulp.task('coveralls', function(callback){
//     var repo_token = process.env.COVERALLS_TOKEN;
//     if (!repo_token){
//         return callback(new Error("COVERALLS_TOKEN environment variable is missing"));
//     }
//     else {
//         fs.writeFile(".coveralls.yml", "service_name: codefresh-io\nrepo_token: " + repo_token, function(err){
//             if (err){
//                 callback(err);
//             }
//             else {
//                 gulp.src('coverage/lcov.info')
//                     .pipe(coveralls());
//             }
//         });
//     }
// });
//
// gulp.task('e2e_extended_test', function(callback) {
//     runSequence('set_e2e_env_vars',
//         'e2e_extended_pre',
//         callback);
// });
//
// gulp.task('e2e_builds_extended_pre', function () {
//     return gulp.src(['*/api/build/*.e2e.extended.spec.js', '!**/node_modules/**/*.js'], {read: false})
//         .pipe(mocha({reporter: 'spec', timeout: '10000'}))
//         .once('end', function () {
//             process.exit();
//         });
// });