'use strict';

var electron = require('electron');
var app = electron.app;
if(require('electron-squirrel-startup')) app.quit();

  app.commandLine.appendSwitch('in-process-gpu')

var BrowserWindow = electron.BrowserWindow;



var mainWindow = null;
const settings = require('electron-settings');

app.on('window-all-closed', function() {

  if (process.platform != 'darwin') {
    app.quit();
  }
});


app.on('ready', function() {

  mainWindow = new BrowserWindow({
    width: 1100,
    minWidth: 700,
    minHeight: 600,
    maxHeight: 600,
    height: 600,
    frame: false,
    thickFrame: true,

    icon: __dirname + '/assets/images/dotavision.ico'
  });

  if (!settings.has('theme')) {
    settings.set('theme', 'Default');
  };
  if (!settings.has('mph')) {
    settings.set('mph', '3');
  };
  if (!settings.has('totals')) {
    settings.set('mph', '20');
  };
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {

    mainWindow = null;
  });
});
