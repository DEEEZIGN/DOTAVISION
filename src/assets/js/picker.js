"use strict";
const Mika = require("mika");
var mika = new Mika();
var SelectedHeroesRadiant = new Array();
var SelectedHeroesDire = new Array();
var InfoHeroesRadiant = new Array(5);
var InfoHeroesDire = new Array(5);
var AllHeroes;
var PickAnalisysArray = new Array(5);
for (var i = 0; i < PickAnalisysArray.length; i++) {
  PickAnalisysArray[i] = new Array(5);
}
function Start() {
  load(true);
  mika.getHeroes().then((Heroes) => {
    Heroes = Heroes.sort(SortProp('localized_name'));
    for (var i = 0; i < Heroes.length; i++) {
      var Hero = '<li><img src="http://media.steampowered.com/apps/dota2/images/heroes/' + Heroes[i].name.replace('npc_dota_hero_', '') + '_sb.png" alt=""><div id="heroname">' + Heroes[i].localized_name.toUpperCase() + '</div><span> ' + Heroes[i].roles[0] + ", " + Heroes[i].roles[1] + '</span></li>';
      $("#heroes").append(Hero);
    }
    AllHeroes = Heroes;
    load(false);
  }).catch((err) => console.log(err));
}
 Start();
$('#inhero').on('input', function() {
  $("#heroes li").addClass("heron").removeClass("heroh");
  $("#heroes li:contains(" + $('#inhero').val().toUpperCase() + ")").addClass("heroh").removeClass("heron");
  $('#heroes').scrollTop(0);
});
$('#heroes').on('click', 'li', function() {
  $('#inhero').val($(this).find("#heroname").text());
  $("#heroes li").removeClass("selected");
  $(this).addClass("selected");
});
function addHero(bool) {
  var FindHeroName = $("#heroes li.selected #heroname").text();
  var SelectedHero = $.grep(AllHeroes, function(e) {
    return e.localized_name.toUpperCase() === FindHeroName;
  })[0];
  if (typeof SelectedHero !== "undefined") {
    if (bool == true && SelectedHeroesRadiant.length < 5) {
      SelectedHeroesRadiant.push(SelectedHero);
      var num = SelectedHeroesRadiant.length - 1;
      $("#teams").first().find(".heron").first().find(".team-hero-icon").append('<img onClick="ViewHeroInfo(true, ' + num + ')" src="http://media.steampowered.com/apps/dota2/images/heroes/' + SelectedHero.name.replace('npc_dota_hero_', '') + '_sb.png" alt="">');
      $("#teams").first().find(".heron").first().removeClass('heron').addClass("heroh");
      ViewHeroInfo(true, num);
    } else if (bool == false && SelectedHeroesDire.length < 5) {
      SelectedHeroesDire.push(SelectedHero);
      var num = SelectedHeroesDire.length - 1;
      $("#teams").first().next().find(".heron").first().find(".team-hero-icon").append('<img onClick="ViewHeroInfo(false, ' + num + ')" src="http://media.steampowered.com/apps/dota2/images/heroes/' + SelectedHero.name.replace('npc_dota_hero_', '') + '_sb.png" alt="">');
      $("#teams").first().next().find(".heron").first().removeClass('heron').addClass("heroh");
      ViewHeroInfo(false, num);
    } else {
      return false;
    }
    $('#inhero').val("");
    $("#heroes li.selected").addClass("hidden");
    $("#heroes li").removeClass("selected");
  }
}
function ClearPicker() {
  $("#heroes li").removeClass("hidden");
  $("#teams #team-hero").removeClass("heroh").addClass("heron");
  $("#teams #team-hero .team-hero-icon").html("");
  $("#hero-icon-img").html("");
  SelectedHeroesRadiant = new Array();
  SelectedHeroesDire = new Array();
  InfoHeroesRadiant = new Array(5);
  InfoHeroesDire = new Array(5);
  $("#picker-hero-name").html("");
  $(".notheaderused").addClass("notheader").removeClass("notheaderused").html("");
  PickAnalisysArray = new Array(5);
  for (var i = 0; i < PickAnalisysArray.length; i++) {
    PickAnalisysArray[i] = new Array(5);
  }
  $("#circle-center span").html("TEAM");
  $("#circle-left span").html(0);
  $("#circle-right span").html(0);
}
function ViewHeroInfo(bool, num) {
  var Team;
  var pNum;
  if (bool) {
    Team = SelectedHeroesRadiant;
    pNum = num;
  } else {
    Team = SelectedHeroesDire;
    pNum = num + 5;
  }
  $(".team-hero-icon").removeClass('opacity');
  $(".team-hero-icon").eq(pNum).addClass('opacity');
  $("#hero-icon-img").html('<img src="http://media.steampowered.com/apps/dota2/images/heroes/' + Team[num].name.replace('npc_dota_hero_', '') + '_lg.png" alt="">')
  var HeroRoles = "";
  $.each(Team[num].roles, function(i, v) {
    HeroRoles += v.toUpperCase() + ", ";
  });
  HeroRoles = HeroRoles.substring(0, (HeroRoles.length - 2));
  $("#picker-hero-name").html(Team[num].localized_name.toUpperCase() + '<span>' + HeroRoles + '</span>');
  ViewPickerInfo(bool, num, Team[num].id);
}
function ViewPickerInfo(bool, num, id) {
  var Team;
  if (bool) {
    Team = InfoHeroesRadiant;
  } else {
    Team = InfoHeroesDire;
  }
  if (typeof Team[num] == 'undefined') {
    load(true);
    mika.getHeroStatsAgainstHero(id).then((WR) => {
      WR = WR.sort(SortProp('wins'));
      Team[num] = WR.reverse();
      load(false);

      PastePickerInfo(bool, num, id);
      PickAnalisys();

    });
  } else {
    PastePickerInfo(bool, num, id);
  }
}
function PastePickerInfo(bool, num, id) {
  var Team;
  var EnemyTeam;
  var HeroInfo;
  if (bool) {
    Team = InfoHeroesRadiant;
    EnemyTeam = InfoHeroesDire;
    HeroInfo = SelectedHeroesRadiant;
  } else {
    Team = InfoHeroesDire;
    EnemyTeam = InfoHeroesRadiant;
    HeroInfo = SelectedHeroesDire;
  }
  var avgWinrate = 0;
  var avgSum = 0;
  $.each(Team[num], function(i, v) {
    avgSum += (v.wins / v.games_played) * 100;
  });
  avgWinrate = (avgSum / Team[num].length).toFixed()

  var CounterPicks = 0;
  var CounterPicksIsThis = 0;
  $(".notheaderused").addClass("notheader").removeClass("notheaderused").html("");

  $.each(Team[num], function(i, v) {
    if (CounterPicks != 15 || CounterPicksIsThis != 15) {
      var WR = 0;
      WR = (v.wins / v.games_played) * 100;
      if (WR > avgWinrate) {
        if (CounterPicksIsThis != 15) {
          $("#picker-hero-info").first().next().find(".notheader").first().append('<img src="http://media.steampowered.com/apps/dota2/images/heroes/' + AllHeroes[v.hero_id].name.replace('npc_dota_hero_', '') + '_sb.png" alt=""><div><span>' + WR.toFixed() + '</span> </div>');
          $("#picker-hero-info").first().next().find(".notheader").first().removeClass("notheader").addClass("notheaderused");
          CounterPicksIsThis++;
        }
      } else if (WR < avgWinrate) {
        if (CounterPicks != 15) {
          $("#picker-hero-info").first().find(".notheader").first().append('<img src="http://media.steampowered.com/apps/dota2/images/heroes/' + AllHeroes[v.hero_id].name.replace('npc_dota_hero_', '') + '_sb.png" alt=""><div><span>' + WR.toFixed() + '</span></div>');
          $("#picker-hero-info").first().find(".notheader").first().removeClass("notheader").addClass("notheaderused");
          CounterPicks++;
        }
      }
    }
  });
}
function PickAnalisys() {
  for (var i = 0; i < PickAnalisysArray.length; i++) {
    for (var z = 0; z < PickAnalisysArray[i].length; z++) {
      if (typeof PickAnalisysArray[i][z] == 'undefined' && typeof SelectedHeroesRadiant[i] !== 'undefined' && typeof SelectedHeroesDire[z] !== 'undefined') {
        var Enemy = InfoHeroesRadiant[i].find(o => o.hero_id === SelectedHeroesDire[z].id);
        PickAnalisysArray[i][z] = ((Enemy.wins / Enemy.games_played) * 100).toFixed();
      }
    }
  }
  ShowPickAnalisys();
}
function ShowPickAnalisys() {
  var sum = 0;
  var num = 0;
  for (var i = 0; i < 5; i++) {
    for (var z = 0; z < 5; z++) {
      if (typeof PickAnalisysArray[i][z] !== 'undefined') {
        sum += parseInt(PickAnalisysArray[i][z]);
        num++;
      }
    }
  }
  if (num != 0) {
    var WinAnalisys = (sum / num).toFixed();
    if (WinAnalisys >= 50) {
      $("#circle-center span").html("RADIANT");
    } else {
      $("#circle-center span").html("DIRE");
    }
    $("#circle-left span").html(WinAnalisys);
    $("#circle-right span").html(100 - WinAnalisys);
    $("#circle-left-half div").css('-webkit-transform', "rotate(" + (Math.abs(WinAnalisys - 50) / 100) * 360  + "deg)");
  }
}
