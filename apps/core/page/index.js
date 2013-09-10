var express = require('express');
var _ = require('lodash');

var server = function(done, config, rootServer, getStyles, getScripts, getAngularTemplates) {
  var app = express();
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.get('*', function(req, res) {
    var scripts = _.filter(getScripts(), function(script) {
      return script.combine !== config.script.combine || script.type === 'link';
    });
    var styles = _.filter(getStyles(), function(style) {
      return style.combine !== config.style.combine || style.type === 'link';
    });
    getAngularTemplates(function(err, angularTemplates) {
      res.render('index', {
        styles: _.pluck(styles, 'requestPath'),
        scripts: _.pluck(scripts, 'requestPath'),
        templates: angularTemplates,
        config: config
      });
    });
  });
  rootServer.use(app);
  done(null, app);
};

module.exports = {
  server: [
    'gleeman:config:base',
    'gleeman:express:server', 
    'gleeman:css:sorted', 
    'gleeman:js:sorted', 
    'gleeman:js:server',
    'gleeman:css:server',
    server,
    'gleeman:http:start'
  ],
  scripts: ['gleeman:js:file', function(done, add) {
    add(__dirname + '/public/*.js', 100);
    done();
  }, 'core:page:server'],
  style: ['core:stylus:add', function(done, add) {
    add(__dirname, 'style/*.styl');
    done();
  }, 'core:page:server'],
  xhrMiddleware: ['gleeman:express:server', function(done, rootServer) {
    rootServer.use(function(req, res, next) {
      req.isXhr = req.accepted[0].value === 'application/json';
      next();
    });
    done();
  }, 'core:page:server'],
  scriptComplete: [
    'core:defaultRenderArgs:add',
    'gleeman:js:sorted',
    'gleeman:config:base',
    'gleeman:js:server',
    'gleeman:js:combine',
    function(done, addRenderArg, getScripts, config) {
      var scripts = _.filter(getScripts(), function(script) {
        return script.type === 'link'
            || !config.script.combine
            || !script.combine;
      });
      addRenderArg('scripts', scripts);
      done();
    },
    'core:defaultRenderArgs:get'
  ],

  styleComplete: [
    'core:defaultRenderArgs:add',
    'gleeman:css:sorted',
    'gleeman:config:base',
    'gleeman:css:server',
    'gleeman:css:combine',
    function(done, addRenderArg, getStyles, config) {
      addRenderArg('styles', _.filter(getStyles(), function(style) {
        return style.combine !== config.style.combine || style.type === 'link';
      }));
      done();
    },
    'core:defaultRenderArgs:get'
  ],
  publicConfig: [
    'core:publicConfig:async',
    'gleeman:config:base',

    function(done, addConfig, config) {
      _.each(
        ['backend'],
        function (item) {
          addConfig(item, function(done) {
            done(null, config[item]);
          });
        }
      );
      done();
    },
    'core:publicConfig:register'
  ],
};

