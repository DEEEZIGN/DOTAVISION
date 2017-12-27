

function SettingsMPH(date) {
  settings.set('mph', date);
  LoadSettings();
  if (Started) {
    ReadFile();
  }
}

function SettingsTheme(name) {
  settings.set('theme', name);
  $('head').append('<link rel="stylesheet" id="styluslink" href="./assets/stylus/style'+ settings.get('theme') +'.styl"/>');
  setTimeout(function(){
    $('head #styluslink').eq(0).remove();
  }, 1000);

  LoadSettings();
}
function SettingsTotals(limit) {
  settings.set('totals', limit);
  LoadSettings();
  if (Started) {
    ReadFile();
  }
}
function LoadSettings() {
  $(".settingsMPH").removeClass("active");
  $("#settingsMPH" + settings.get('mph')).addClass("active");
  $(".settingsTheme").removeClass("active");
  $("#settingsTheme" + settings.get('theme')).addClass("active");
  $(".settingsTotals").removeClass("active");
  $("#settingsTotals" + settings.get('totals')).addClass("active");
}
