var path = require('path');


var appendExtension = '';
if (process.argv[2] === '--buildFor') {
  appendExtension = '.' + process.argv[3]
}
if (process.argv[2] === '--watch' && process.argv[3] === '--buildFor') {
  appendExtension = '.' + process.argv[4]
}
var ModuleResolver = {
  apply: function(resolver) {
    resolver.plugin('module', function(request, callback) {
      if (request.request[0] === '#') {
        var req = request.request.substr(1);

        var obj = {
          path: request.path,
          request: req + appendExtension,
          query: request.query,
          directory: request.directory
        };
        var enclosingDirPath = '';
        if (!path.isAbsolute(req)) {
          enclosingDirPath = path.join(request.path, obj.request);
        };
        this.fileSystem.stat(enclosingDirPath + '.js', function(err, stats) {

          if (err || !stats.isFile()) {
            this.fileSystem.stat(enclosingDirPath + '.jsx', function(err, stats) {
              if (err || !stats.isFile()) {
                obj = {
                  path: request.path,
                  request: req,
                  query: request.query,
                  directory: request.directory
                };
                this.doResolve(['file'], obj, callback);
              } else {
                this.doResolve(['file'], obj, callback);
              };
            }.bind(this));

          } else {
            this.doResolve(['file'], obj, callback);
          }

        }.bind(this));



      }
      else {
        callback();
      }
    });
  }
};

module.exports = ModuleResolver;