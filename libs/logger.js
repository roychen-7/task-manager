var log4js = require('log4js');

log4js.configure({
  appenders: [{
    type: 'file',
    filename: global.config.get('logPath') + '/task.log', 
    maxLogSize: 1024 * 1024 * 100,
    category: 'task' 
  }]
});

module.exports = log4js;
