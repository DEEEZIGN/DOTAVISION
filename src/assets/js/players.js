var whereIsSteam = require('where-is-steam');
var FullPathToLog = "";
var fs = require('fs');
var PlayersID = new Array();
var Started = false;
var Ranks = new Array("UNRUNKED", "HERALD", "GUARDIAN", "CRUSADER", "ARCHON", "LEGEND", "ANCIENT", "DIVINE");
var HeroesRadiant, HeroesDire;

function StartPreMatch () {
  if (!Started) {
    Started = true;
    var directory = whereIsSteam().then((dir) => {
      var PathToLog = "\\dota 2 beta\\game\\dota\\server_log.txt"
      if (Array.isArray(dir)) {
        for (var i = 0; i < dir.length; i++) {
          FullPathToLog = dir[i] + PathToLog;
          if (fs.existsSync(FullPathToLog)) {
            ReadFile();
          }
        }
        } else {
          FullPathToLog = dir + PathToLog;
          if (fs.existsSync(FullPathToLog)) {
            ReadFile();
          }

      }

    });
  }
}

function ReadFile() {
  var Log = fs.readFileSync(FullPathToLog).toString().split('\n');
  load(true);
  LoadPlayers(Log);
  fs.watchFile(FullPathToLog, function() {
    var Log = fs.readFileSync(FullPathToLog).toString().split('\n');
    load(true);
    LoadPlayers(Log);
  });
}

function LoadPlayers(Log) {
  var LastLine = "";
  PlayersID = new Array();
  for (var i = 0; i < Log.length; i++) {
    LastLine = Log[Log.length - 1 - i].toString();
    var Pattern = new RegExp(/\[\U\:.\:(.*?)\]/g);
    var Matches = LastLine.match(Pattern);
    if (Matches != null && Matches.length >= 10) {
      for (var i = 0; i < 10; i++) {
        PlayersID[i] = Matches[i].slice(5, Matches[i].length - 1);
      }
      break;
    }
  }
  GetPlayersInfo();
}

function GetPlayersInfo() {
  var promises = new Array(PlayersID.length * 3);
  for (var i = 0; i < PlayersID.length; i++) {
    var M = new Mika();
    promises[i] = M.getPlayer(PlayersID[i]);
    if (settings.get('totals') == 0) {
      promises[i + PlayersID.length * 2] = M.getPlayerTotals(PlayersID[i]);
    } else {
      promises[i + PlayersID.length * 2] = M.getPlayerTotals(PlayersID[i], {  "limit": settings.get('totals') });
    }
    if (settings.get('mph') == 0) {
      promises[i + PlayersID.length] = M.getPlayerHeroes(PlayersID[i]);
    } else {
      promises[i + PlayersID.length] = M.getPlayerHeroes(PlayersID[i], {  "date": 30 * settings.get('mph') });
    }

  }
  Promise.all(promises).then((results) => {
    $("#players-analisys-name-ava").html("");
    $("#players-analisys-name-text").html("");
    $(".players-analisys-rank").html("");
    $(".players-analisys-mph #players-analisys-mph").html("");
    $(".players-analisys-links").html("");
    $("#players-analisys-team-radiant-mph").html("");
    $("#players-analisys-team-dire-mph").html("");
    $(".table-totals-efficiency").html("");
    $(".table-totals-kda").html("");
    $(".table-totals-xpm").html("");
    $(".table-totals-gpm").html("");
    $(".table-totals-damage").html("");
    $(".table-totals-healing").html("");
    for (var i = 0; i < PlayersID.length; i++) {

      var PlayerName, PlayerAva, PlayerRank, PlayerAccountID;
      PlayerRank = results[i].rank_tier;

      if (typeof results[i].profile != "undefined") {

        PlayerName = results[i].profile.personaname;
        PlayerAva = results[i].profile.avatarmedium;
        PlayerAccountID = results[i].profile.account_id;

        for (var t = 0; t < 10; t++) {
          var HeroID = parseInt(results[i+10][t].hero_id);
          var Hero = $.grep(AllHeroes, function(e){ return e.id == HeroID; })[0];
          $(".players-analisys-table-row").eq(i).find("#players-analisys-mph").append('<img src="http://media.steampowered.com/apps/dota2/images/heroes/' + Hero.name.replace('npc_dota_hero_', '') + '_sb.png" alt="">');
        }

      } else {
        PlayerName = null;
        PlayerAva = null;
        PlayerAccountID = null;
      }

      $(".players-analisys-table-row").eq(i).find("#players-analisys-name-ava").html(PlayerAva == null ? "" : '<img src="' + (PlayerAva == null ? "" : PlayerAva) + '" alt="">');
      $(".players-analisys-table-row").eq(i).find("#players-analisys-name-text").html(PlayerName == null ? "ANON" : PlayerName);
      var Stars = PlayerRank % 10;
      var Rank = (PlayerRank - Stars)/10;
      var RMM = ((Rank-1)*6*140+Stars*140);
      if (RMM < 0) {
        RMM = 0;
      }
      $(".players-analisys-table-row").eq(i).find(".players-analisys-rank").html(RMM + " [" + Ranks[Rank] + " " + Stars + "]");
      $(".players-analisys-table-row").eq(i).find(".players-analisys-links").html(PlayerAccountID == null ? ('<a href="#">NO DATA</a>') : ('<a onclick="OpenLink(\'https://www.opendota.com/players/' + PlayerAccountID + '\')" href="#">OPENDOTA</a>'));
      results[i+10] = results[i+10].sort(SortProp('hero_id'));
    }
    HeroesRadiant = results[10];
    HeroesDire = results[15];
    for (var i = 0; i < 4; i++) {
      for (var z = 0; z < HeroesRadiant.length; z++) {
        HeroesRadiant[z].games += results[11+i][z].games;
        HeroesDire[z].games += results[16+i][z].games;
      }
    }
    HeroesRadiant = HeroesRadiant.sort(SortProp('games'));
    HeroesDire = HeroesDire.sort(SortProp('games'));
    HeroesRadiant.reverse();
    HeroesDire.reverse();
    for (var i = 0; i < 10; i++) {
      $("#players-analisys-team-radiant-mph").append('<img src="http://media.steampowered.com/apps/dota2/images/heroes/' + $.grep(AllHeroes, function(e){ return e.id == HeroesRadiant[i].hero_id; })[0].name.replace('npc_dota_hero_', '') + '_sb.png" alt="">');
      $("#players-analisys-team-dire-mph").append('<img src="http://media.steampowered.com/apps/dota2/images/heroes/' + $.grep(AllHeroes, function(e){ return e.id == HeroesDire[i].hero_id; })[0].name.replace('npc_dota_hero_', '') + '_sb.png" alt="">')
    }

    // totals
    var maxTotals = new Array(0,0,0,0,0,0);
    var allTotals = new Array(0,0,0,0,0,0);

    for (var i = 0; i < PlayersID.length; i++) {
      if (results[2 * PlayersID.length + i][0].n !== 0) {

        var Totals = new Array(6);
        Totals[0] = (results[2 * PlayersID.length + i][8].sum / results[2 * PlayersID.length + i][8].n).toFixed();
        Totals[1] = (results[2 * PlayersID.length + i][3].sum / results[2 * PlayersID.length + i][3].n).toFixed();
        Totals[2] = (results[2 * PlayersID.length + i][4].sum / results[2 * PlayersID.length + i][4].n).toFixed();
        Totals[3] = (results[2 * PlayersID.length + i][5].sum / results[2 * PlayersID.length + i][5].n).toFixed();
        Totals[4] = (results[2 * PlayersID.length + i][13].sum / results[2 * PlayersID.length + i][13].n).toFixed();
        Totals[5] = (results[2 * PlayersID.length + i][11].sum / results[2 * PlayersID.length + i][11].n).toFixed();

        allTotals[i] = Totals;

        $(".table-totals.fix").eq(i).find(".table-totals-efficiency").html(Totals[0]);
        $(".table-totals.fix").eq(i).find(".table-totals-kda").html(Totals[1]);
        $(".table-totals.fix").eq(i).find(".table-totals-gpm").html(Totals[2]);
        $(".table-totals.fix").eq(i).find(".table-totals-xpm").html(Totals[3]);
        $(".table-totals.fix").eq(i).find(".table-totals-healing").html(Totals[4]);
        $(".table-totals.fix").eq(i).find(".table-totals-damage").html(Totals[5]);

      } else {
          allTotals[i] = 0;
      }
    }

    // max totals
    var tableBlocks = new Array(".table-totals-efficiency",".table-totals-kda",".table-totals-gpm",".table-totals-xpm",".table-totals-healing",".table-totals-damage")
    for (var i = 0; i < allTotals.length; i++) {
      for (var z = 0; z < allTotals.length; z++) {
        if (allTotals[i] != 0 && allTotals[i][z] >= maxTotals[z]) {
            if (allTotals[i][z] > maxTotals[z]) {
              $(tableBlocks[z]).removeClass("max");
            }
            maxTotals[z] = allTotals[i][z];
            $(".table-totals.fix").eq(i).find(tableBlocks[z]).addClass("max");
        }
      }

    }

    load(false);
  }).catch((err) => GetPlayersInfo());
}

function openSummary(bool) {
  $('#popup-overlay div').load('summary.html', function(){
    if (bool) {
      $("#summary-team-name").html("RADIANT");
      $("#players-analisys-team-mph-popup").html($("#players-analisys-team-radiant-mph").html())
    } else {
      $("#summary-team-name").html("DIRE");
      $("#players-analisys-team-mph-popup").html($("#players-analisys-team-dire-mph").html())
    }
    $('#popup-wrapper').addClass("active");
  });
}

function openTotals() {
  $("#PlayersTotals").toggleClass("active");
  $("#totals").toggleClass("active");
}
