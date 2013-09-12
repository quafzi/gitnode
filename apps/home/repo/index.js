module.exports = {
  server: [
    'gleeman:config:base',
    'gleeman:express:express',
    'gleeman:express:server', 
    'core:defaultRenderArgs:get',
    'git:base:loadRepo',
    function(done, config, express, expressServer, renderArgs, loadRepo) {
      server = express();
      server.set('views', __dirname + '/views');
      server.set('view engine', 'jade');
      server.get('/:repo', function(req, res) {
        var args = renderArgs(req);
        loadRepo(req.params.repo, function (err, log){
          res.render('log', {
            "error": err,
            "history": log,
            "repo": req.params.repo
          });
        });
      });
      expressServer.use(server);
      done(null, server);
    }, 'core:page:server'],
}

