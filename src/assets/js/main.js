"use strict";
const remote = require('electron').remote;
var shell = require('electron').shell;
const settings = require('electron-settings');
$('head').append('<link id="cssstyle" rel="stylesheet" href="./assets/stylus/style'+ settings.get('theme') +'.styl"/>');

$('#minimize').click(function() {
  var window = remote.getCurrentWindow();
  window.minimize();
});
$('#close').click(function() {
  var window = remote.getCurrentWindow();
  window.close();
});
$(document).on('click', 'a[href^="http"]', function(event) {
  event.preventDefault();
  shell.openExternal(this.href);
});
function load(bool) {
  if (bool) {
    $("#loader").addClass("loader-on");
  } else {
    $("#loader").removeClass("loader-on");
  }
}
$('.showcontent').click(function() {
  $('.showcontent').toggleClass("active");
  $('#players-analisys').toggleClass("hidden");
  $('#picker').toggleClass("hidden");
});
function SortProp(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}
$("#popup-overlay").click(function(){
  $("#popup-wrapper").removeClass("active");
  $("#show-about").removeClass("active");
  $("#show-settings").removeClass("active");
}).children().click(function(e) {
  return false;
});
function ShowAbout() {
  $('#popup-overlay div').load('about.html', function(){
    var appVersion = require('electron').remote.app.getVersion();
    $("#appv").html(appVersion);
    $('#popup-wrapper').addClass("active");
    $("#show-about").addClass("active");
  });
}
function ShowSettings() {
  $('#popup-overlay div').load('settings.html', function(){
  LoadSettings();
  $('#popup-wrapper').addClass("active");
  $("#show-settings").addClass("active");
  });
}
