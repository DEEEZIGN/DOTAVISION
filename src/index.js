import { app, BrowserWindow, Tray, Menu } from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

//const settings = require('electron-settings');
var path = require('path');
var url = require('url');
var iconpath = path.join(__dirname + '/images/dotavision.ico');
var win = null;


function createWindow() {

  // Window settings
  win = new BrowserWindow({
  width: 950,
  minWidth: 950,
  minHeight: 600,
  maxHeight: 600,
  height: 600,
  frame: false,
  thickFrame: true,
  backgroundColor: '#395792',
  show: false,
  icon: iconpath
});

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
  }));

  win.once('ready-to-show', () => {
     win.show();
 })

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

  win.on('close', function(event) {
    app.quit();
  });

  win.on('show', function() {
    appIcon.setHighlightMode('always');
  });

}

const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (win) {
    if (win.isMinimized()) win.show()
    win.focus()
  }

})

if (isSecondInstance) {
  app.quit()
}

app.on('ready', createWindow)
