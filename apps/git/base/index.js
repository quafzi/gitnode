var _     = require('lodash');
var async = require('async');

module.exports = {
  isGitDir: [
    'gleeman:config:base',
    'gleeman:require:git',
    function(done, config, git) {
      done(null, function (dir, checkDone) {
        var repo = new git.Git(config.gitroot + '/' + dir);
        repo.git(
          'rev-parse', {'is-inside-git-dir': true},
          function(err) {
            checkDone(_.isNull(err));
          }
        );
      });
    }
  ],
  loadRepos: [
    'gleeman:config:base',
    'gleeman:require:fs',
    'git:base:isGitDir',
    function(done, config, fs, isGitDir) {
      done(null, function(loadDone) {
        async.waterfall([
          function(lsDone) {
            fs.readdir(config.gitroot, lsDone);
          },
          function(dirs, filterDone) {
            console.log(dirs);
            async.filter(dirs, isGitDir, filterDone);
          }
        ], loadDone);
      });
    }
  /*
  ],
  loadRepo: [
    'gleeman:config:base',
    'gleeman:require:git',
    function(done, config, git) {
      done(null, function(dir, logDone) {
        var repo = new git.Git(config.gitroot + '/' + dir);
        repo.log(null, null, {}, logDone);
      });
    }
    */
  ]
}

