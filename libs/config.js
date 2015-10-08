var fs = require('fs');
var _ = require('underscore');

module.exports = function Config (configFile) {
  // check path
  fs.exists(configFile, function (exists) {
    if (!exists) { throw new ConfigException('Can not find config file: ' + configFile); }
  });

  var _config = require(configFile); 

  return {
    get: getConfig(_config)
  }
}

function getConfig(_config) {
  return function(name) {
    // Please do not use true/false in your config
    if (_config[name] === undefined) { return false; }
    return cloneConfig(_config, name);
  }
}

// deep clone by recursive
function cloneConfig(_config, name) {
  if (!_.isObject(_config[name]) && !_.isArray(_config[name])) { return _config[name]; }
  
  var _c = {};
  for (var i in _config[name]) {
    if (_.isObject(_config[name][i]) || _.isArray(_config[name][i])) {
      _c[i] = cloneConfig(_config[name], i);
    } else {
      _c[i] = _config[name][i];
    }
  }

  return _c;
}

// exception class
function ConfigException(message) {
  this.message = message;
}
