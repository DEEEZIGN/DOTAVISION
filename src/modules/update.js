import { fail } from 'assert';

'use strict';
const os = require('os');
const {autoUpdater, dialog} = require('electron').remote;
const app = require('electron').remote.app;
const version = app.getVersion();
const platform = os.platform() + '_' + os.arch();  // usually returns darwin_64
const updaterFeedURL = 'http://dotavision.com/update/' + platform;


var update = function () {
	setTimeout(() => autoUpdater.quitAndInstall(), 1);
}

function appUpdater() {
	autoUpdater.setFeedURL(updaterFeedURL);
	/* Log whats happening
	TODO send autoUpdater events to renderer so that we could console log it in developer tools
	You could alsoe use nslog or other logging to see what's happening */
	autoUpdater.on('error', err => console.log("Update error"));
	autoUpdater.on('checking-for-update', () => console.log('checking-for-update'));
	autoUpdater.on('update-available', () => console.log('update-available'));
	autoUpdater.on('update-not-available', () => console.log('update-not-available'));

	// Ask the user if update is available
	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
		console.log('update-downloaded');
	});
	// init for updates
	autoUpdater.checkForUpdates();
}

exports = module.exports = {
	appUpdater
};