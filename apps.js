var join = require('path').join;

module.exports =  {
  appsPath: join(__dirname, 'apps'),
  apps: {
    dev: {
      base: ''
    },
    core: {
      defaultRenderArgs: '',
      page: '',
      publicConfig: '',
      stylus: '',
    },
    home: {
      base: '',
      repo: '',
    },
    git: {
      base: '',
    }
  },
  packages: [
    'gleeman-config',
    'gleeman-express',
    'gleeman-express-http',
    'gleeman-express-css',
    'gleeman-express-js',
    'gleeman-express-renderargs',
    'gleeman-commander'
  ]
};

