var requireAll = require('require-all');
var later = require('later');
var _ = require('underscore');
var moment = require('moment');
var uuid = require('node-uuid');     
var logger = require('./logger').getLogger('task');

// set later to use local time
later.date.localTime();

function TaskManager (taskPath) {
  var tasks = new TaskLoader(taskPath);  
  new TaskPool(tasks);
}

function TaskLoader(taskPath) {
  // load js file from taskPath
  return requireAll({
    dirname: taskPath,
    filter: /(.+)\.js$/,
    excludeDirs: /^\.(git|svn)$/
  });
}

function TaskPool(tasks) {
  var _schedulePool = {};

  _.mapObject(tasks, function (task, key) {
    // init task using later and put timer into _schedulePool
    _schedulePool[key] = initTask(task, key);
  });

  function initTask(task, key) {
    var sched = later.parse.cron(task.cronTime, true); 
    var timer = later.setInterval(function() {
      // gen unique jobId
      var jobId = uuid.v4();
      
      // log when beginning
      logger.info('Task[' + jobId + ']: ' + key + ' start');

      // handle the exception during execute
      try {
        task.run(function(err) {
          // log after finish
          if (err) {
            logger.error('Task[' + jobId + ']: ' + key + ' failed because of:');
            logger.error(err);
          } else {
            logger.info('Task[' + jobId + ']: ' + key + ' end');
          }
        });
      } catch (e) {
        logger.fatal('Task[' + jobId + ']: ' + key + ' failed because of:');
        logger.fatal(e);
      }
    }, sched);

    return timer;
  }
}

module.exports = TaskManager;
