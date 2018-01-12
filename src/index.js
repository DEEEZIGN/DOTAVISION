'use strict';
var { app, BrowserWindow, Tray, Menu } = require('electron');

// Squirrel
if (require('electron-squirrel-startup')) app.quit();

// Autolaunch
var AutoLaunch = require('auto-launch');
var DVAutoLauncher = new AutoLaunch({
  name: 'DOTAVISION'
});
DVAutoLauncher.enable();
DVAutoLauncher.isEnabled().then(function(isEnabled) {
  if (isEnabled) {
    return;
  };
  DVAutoLauncher.enable();
}).catch(function(err) {});

const settings = require('electron-settings');
var path = require('path');
var url = require('url');
var iconpath = path.join(__dirname + '/assets/images/dotavision.ico');
var win;


function createWindow() {

  // Window settings
  win = new BrowserWindow({
  width: 1100,
  minWidth: 700,
  minHeight: 600,
  maxHeight: 600,
  height: 600,
  frame: false,
  thickFrame: true,
  icon: iconpath
});

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
  }));

  // Tray
  var appIcon = new Tray(iconpath);
  var contextMenu = Menu.buildFromTemplate([{
      label: 'Open',
      click: function() {
        win.show();
      }
  },
  {
      label: 'Quit',
      click: function() {
        app.isQuiting = true;
        app.quit();
      }
  }]);

  appIcon.setContextMenu(contextMenu);

  appIcon.on('click', function(event) {
    win.isVisible() ? win.hide() : win.show();
  });

  // Hide to tray
  win.on('close', function(event) {
    win = null;
  });

  win.on('show', function() {
    appIcon.setHighlightMode('always');
  });

  // Settings defaults
  if (!settings.has('theme')) {
    settings.set('theme', 'Default');
  };
  if (!settings.has('mph')) {
    settings.set('mph', '3');
  };
  if (!settings.has('totals')) {
    settings.set('totals', '20');
  };

}
app.on('ready', createWindow)
