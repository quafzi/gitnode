module.exports = {
  server: [
    'gleeman:config:base',
    'gleeman:express:express',
    'gleeman:express:server', 
    'core:defaultRenderArgs:get',
    'git:base:loadRepos',
    function(done, config, express, expressServer, renderArgs, loadRepos) {
      server = express();
      server.set('views', __dirname + '/views');
      server.set('view engine', 'jade');
      server.get('/', function(req, res) {
        var args = renderArgs(req);
        loadRepos(function (repos){
          res.render('index', {"repos": repos});
        });
      });
      expressServer.use(server);
      done(null, server);
    }, 'core:page:server'],
}
