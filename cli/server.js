#!/usr/bin/env node

var spawn = require('child_process').spawn,
    fs = require('fs'),
    path = require('path'),
    logo = fs.readFileSync(path.join(__dirname,'logo.txt'), 'utf8'),
    server = require('commander'),
    hostname = require('os').hostname(),
    inquirer = require('inquirer'),
    chalk = require('chalk'),
    package = require('./package.json');

var command = process.platform === 'win32' ? 'forever.cmd' : 'forever',
    node_command = 'node --es_staging';

server._name = 'adafruit-io server';

function install() {

  if(require('os').platform() !== 'linux')
    return console.error('[error]   running adafruit io as a service is only supported on linux');

  process.env.AIO_PORT = server.port || 8080;
  process.stdout.write(logo);
  console.log(chalk.bold('[status]') + '  starting service...');

  var child = spawn('forever-service', ['install', '-s', 'index.js', '--foreverOptions', '" -c node --es_staging"', '--start', 'aioserver'], {
    cwd: path.join(__dirname, 'server'),
    env: process.env,
    detached: true
  });

  console.log(chalk.bold('[status]') + `  adafruit io is now ready at http://${hostname}:${process.env.AIO_PORT}/`);
  console.log(chalk.bold('[info]') + `    documentation is available at http://${hostname}:${process.env.AIO_PORT}/api/docs\n`);

  child.on('error', console.log);
  child.on('exit', function(code) {
    process.exit(code);
  });
}

function remove() {

 if(require('os').platform() !== 'linux')
    return console.error('[error]   running adafruit io as a service is only supported on linux');

  var child = spawn('forever-service', ['delete', 'aioserver'], {
    cwd: path.join(__dirname, 'server'),
    env: process.env,
    detached: true
  });

  console.log(chalk.bold('[status]') + ' stopping service...\n');

  child.on('error', console.log);
  child.on('exit', function(code) {
    process.exit(code);
  });
}

function start() {

  process.env.AIO_PORT = server.port || 8080;
  process.stdout.write(logo);
  console.log(chalk.bold('[status]') + '  starting server...');

  var child = spawn(command, ['start',  '-c', node_command, '-s', 'index.js'], {
    cwd: path.join(__dirname, 'server'),
    env: process.env,
    detached: true
  });

  console.log(chalk.bold('[status]') + `  adafruit io is now ready at http://${hostname}:${process.env.AIO_PORT}/`);
  console.log(chalk.bold('[info]') + `    documentation is available at http://${hostname}:${process.env.AIO_PORT}/api/docs\n`);

  child.on('error', console.log);
  child.on('exit', function(code) {
    process.exit(code);
  });
}

function restart() {

  var child = spawn(command, ['restart', 'index.js'], {
    cwd: path.join(__dirname, 'server'),
    env: process.env,
    detached: true
  });

  console.log(chalk.bold('[status]') + ' restarting server...\n');

  child.on('error', console.log);
  child.on('exit', function(code) {
    process.exit(code);
  });
}

function stop() {

  var child = spawn(command, ['stop', 'index.js'], {
    cwd: path.join(__dirname, 'server'),
    env: process.env,
    detached: true
  });

  console.log(chalk.bold('[status]') + ' stopping server...\n');

  child.on('error', console.log);
  child.on('exit', function(code) {
    process.exit(code);
  });
}

function configure(cb, override) {

  override = override || false;
  cb = cb || function() {};

  var config = {username: '', key: ''};

  if(! override) {

    if(process.env.AIO_SERVER_USER && process.env.AIO_SERVER_KEY)
      return cb();

    try {
      config = JSON.parse(fs.readFileSync(path.join(__dirname, 'server', '.aio_auth')));
      process.env.AIO_SERVER_USER = config.username;
      process.env.AIO_SERVER_KEY = config.key;
    } catch(err){}

    if(process.env.AIO_SERVER_USER && process.env.AIO_SERVER_KEY)
      return cb();

  }

  var questions = [
    {
      type: 'input',
      name: 'username',
      message: 'Username to use when authenticating requests locally:',
      default: config.username
    },
    {
      type: 'input',
      name: 'key',
      message: 'Adafruit IO Key to use when authenticating requests locally:',
      default: config.key
    }
  ];

  console.log(chalk.bold.underline('Adafruit IO Local Setup'));

  inquirer.prompt(questions, function(answers) {

    process.env.AIO_SERVER_USER = answers.username;
    process.env.AIO_SERVER_KEY = answers.key;

    fs.writeFileSync(path.join(__dirname, 'server', '.aio_auth'), JSON.stringify(answers));

    cb();

  });

}

server.version(package.version);
server.option('-p, --port <n>', 'http port', parseInt);
server.command('config').description('configure the local server').action(configure.bind(this, console.log, true));
server.command('install').description('installs server service (linux only)').action(configure.bind(this, install, false));
server.command('remove').description('removes server service (linux only)').action(remove);
server.command('start').description('starts server daemon').action(configure.bind(this, start, false));
server.command('restart').description('restarts server daemon').action(restart);
server.command('stop').description('stops server daemon').action(stop);
server.parse(process.argv);

if (!process.argv.slice(2).length)
  server.outputHelp();

