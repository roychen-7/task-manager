var express = require('express');

var Config = require('./libs/config');

var app = express();

app.set('env', 'dev');

global.config = new Config(__dirname + '/configs/' + app.get('env') + '/' + 'config.json');

var TaskManager = require('./libs/task_manager');
new TaskManager(__dirname + '/tasks');

module.exports = app;
