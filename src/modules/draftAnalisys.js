const openDota = require("mika");
var openDotaObj = new openDota();


module.exports = {
  heroes: openDotaObj.getHeroes().then((heroes) => {
    var heroesOutput = [];

    for (var i = 0; i < heroes.length; i++) {
      heroesOutput.push({
          id: heroes[i].id,
          name: heroes[i].localized_name,
          avatar: 'http://media.steampowered.com/apps/dota2/images/heroes/' + heroes[i].name.replace('npc_dota_hero_', '') + '_sb.png',
          fullname: heroes[i].name.replace('npc_dota_hero_', ''),
          roles: heroes[i].roles,
          winrate: '',
          counter: '',
          counterThis: '',
          matchups: ''
      });
    }
    heroesOutput.sort(SortProp('name'));
    return  heroesOutput;
  }),
  draftAnalisys: function(draft) {
    var chanceToWinRadiant = 0;
    var count = 0;

    for (let i = 0; i < 5; i++) {
      if (draft[i].matchups) {
        for (let k = 0; k < 5; k++) {
          if (draft[k + 5].matchups) {
            var wr = draft[i].matchups.find(hero => hero.id === draft[k + 5].id);
            if (wr) {
              chanceToWinRadiant += parseInt(wr.winrate);
              count ++;
            }
           
          }
          
        }
      }
    }

    if (count == 0) {
      return 50;
    } else {
      return (chanceToWinRadiant / count).toFixed();
    }
  },
  heroMatchups: function(id) {
     return openDotaObj.getHeroMatchups(id).then((matchups) => {

        var matchupsOutput = [];
        var winrate = 0;
        var games = 0;
        var wins = 0;

        var counter = [];
        var counterThis = [];

        for (var i = 0; i < matchups.length; i++) {
          matchupsOutput.push({
            id: matchups[i].hero_id,
            games: matchups[i].games_played,
            winrate: ((matchups[i].wins / matchups[i].games_played) * 100).toFixed()
          });
          games += matchups[i].games_played;
          wins += matchups[i].wins;
        }

        winrate = ((wins / games) * 100).toFixed();
        matchupsOutput = matchupsOutput.sort(SortProp('games')).reverse();

        for (var i = 0; i < matchupsOutput.length; i++) {
          if (counter.length < 8 && (matchupsOutput[i].winrate <= winrate && matchupsOutput[i].winrate < 50)) {
            counter.push({
              id: matchupsOutput[i].id,
              winrateAgainst: 100 - matchupsOutput[i].winrate
            });
          }
          if (counterThis.length < 8  && (matchupsOutput[i].winrate >= winrate  && matchupsOutput[i].winrate >= 50)) {
            counterThis.push({
              id: matchupsOutput[i].id,
              winrateAgainst: 100 - matchupsOutput[i].winrate
            });
          }
        }

      return [matchupsOutput, winrate, counter, counterThis];
    }).catch((err) => this.heroMatchups(id))
  }
}

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