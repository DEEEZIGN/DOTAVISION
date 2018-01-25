const settings = require('electron-settings');

if (!settings.has('language')) {
    settings.set('language', 'en');
}

if (!settings.has('theme')) {
    settings.set('theme', 'default');
}

if (!settings.has('mostPopularHeroes')) {
    settings.set('mostPopularHeroes', '30');
}

if (!settings.has('totals')) {
    settings.set('totals', '20');
}
