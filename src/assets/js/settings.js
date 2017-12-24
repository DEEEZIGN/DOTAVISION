

function SettingsMPH(date) {
  settings.set('mph', date);
  LoadSettings();
  if (Started) {
    ReadFile();
  }
}

function SettingsTheme(name) {
  settings.set('theme', name);
  $("#cssstyle").remove();
  $('head').append('<link id="cssstyle" rel="stylesheet" href="./assets/stylus/style'+ settings.get('theme') +'.styl"/>');
  LoadSettings();
}
function SettingsTotals(limit) {
  settings.set('totals', limit);
  LoadSettings();
}
function LoadSettings() {
  $(".settingsMPH").removeClass("active");
  $("#settingsMPH" + settings.get('mph')).addClass("active");
  $(".settingsTheme").removeClass("active");
  $("#settingsTheme" + settings.get('theme')).addClass("active");
  $(".settingsTotals").removeClass("active");
  $("#settingsTotals" + settings.get('totals')).addClass("active");
}
