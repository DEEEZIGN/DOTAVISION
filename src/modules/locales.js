const path = require("path")
const electron = require('electron')
const fs = require('fs');
const settings = require('electron-settings');
let loadedLanguage;
let app = electron.app ? electron.app : electron.remote.app

module.exports = i18n;

function i18n() {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, "/locales/" + settings.get('language') + '.js'), 'utf8'))
}

i18n.prototype.__ = function(phrase) {
    let translation = loadedLanguage[phrase]
    if(translation === undefined) {
         translation = phrase
    }
    return translation
}
