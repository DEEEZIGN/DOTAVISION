'use strict';

var {
  app,
  BrowserWindow,
  Tray,
  Menu
} = require('electron')
const settings = require('electron-settings');

if (require('electron-squirrel-startup')) app.quit();
var mainWindow = null;

// Autolaunch
var AutoLaunch = require('auto-launch');
var DVAutoLauncher = new AutoLaunch({
    name: 'DOTAVISION'
});
DVAutoLauncher.enable();
DVAutoLauncher.isEnabled()
.then(function(isEnabled){
    if(isEnabled){
        return;
    }
    DVAutoLauncher.enable();
})
.catch(function(err){
});

// window
var path = require('path');
var url = require('url');
var iconpath = path.join(__dirname + '/assets/images/dotavision.ico');
var win;

function createWindow() {

  win = new BrowserWindow({
    width: 1100,
    minWidth: 700,
    minHeight: 600,
    maxHeight: 600,
    height: 600,
    frame: false,
    thickFrame: true,
    icon: __dirname + '/assets/images/dotavision.ico'
  })
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
  }))
  var appIcon = new Tray(iconpath);
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'OPEN DOTAVISION',
      click: function() {
        win.show();
      }
    },
    {
      label: 'QUIT',
      click: function() {
        app.isQuiting = true;
        app.quit();

      }
    }
  ])
  // Settings
  if (!settings.has('theme')) {
    settings.set('theme', 'Default');
  };
  if (!settings.has('mph')) {
    settings.set('mph', '3');
  };
  if (!settings.has('totals')) {
    settings.set('totals', '20');
  };

  appIcon.setContextMenu(contextMenu);
  appIcon.on('click', function(event) {
    win.isVisible() ? win.hide() : win.show();
  });
  win.on('close', function(event) {
    win = null;
  });
  win.on('show', function() {
    appIcon.setHighlightMode('always');
  });

}
app.on('ready', createWindow)
