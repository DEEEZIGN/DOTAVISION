<template>
  <div class="content">
    <div v-bind:class="{ active: isActiveContent == 0 }">
      <div class="heroesChoice">
        <div class="heroesList">
          <div class="hero" v-for="hero in heroes" v-bind:class="{ active: heroSearch(hero.name, enteredHeroName), 'selected': hero.id == selectedHeroId, 'inDraft': drafts.find(heroInDraft => heroInDraft.id === hero.id) }" v-on:click="select(hero.id)">
            <img v-bind:src="hero.avatar" alt="">
            <div class="heroName">{{ hero.name }}</div>
          </div>
        </div>
        <input class="heroInput" v-model="enteredHeroName" v-bind:placeholder="locale('Enter hero name...')" value="">
        <div v-on:click="addHero(0)" class="heroAdd heroAddButton">Radiant</div>
        <div class="heroAdd">{{ locale('Add') }}</div>
        <div v-on:click="addHero(5)" class="heroAdd heroAddButton">Dire</div>
      </div>
      <div class="draftAnalisys">
        <div class="team">
          <div class="name" v-bind:class="{ active: isActiveContent == 1 }">Radiant</div>
          <div class="draft">
            <img v-bind:src="drafts[0].id ? drafts[0].avatar : './images/empty_hero_icon.svg'" v-bind:class="{active: (drafts[0].id &&  0 == draftSelectedId )}" v-on:click="drafts[0].id ? draftSelectedId = 0 : ''">
            <img v-bind:src="drafts[1].id ? drafts[1].avatar : './images/empty_hero_icon.svg'" v-bind:class="{active: (drafts[1].id &&  1 == draftSelectedId )}" v-on:click="drafts[1].id ? draftSelectedId = 1 : ''">
            <img v-bind:src="drafts[2].id ? drafts[2].avatar : './images/empty_hero_icon.svg'" v-bind:class="{active: (drafts[2].id &&  2 == draftSelectedId )}" v-on:click="drafts[2].id ? draftSelectedId = 2 : ''">
            <img v-bind:src="drafts[3].id ? drafts[3].avatar : './images/empty_hero_icon.svg'" v-bind:class="{active: (drafts[3].id &&  3 == draftSelectedId )}" v-on:click="drafts[3].id ? draftSelectedId = 3 : ''">
            <img v-bind:src="drafts[4].id ? drafts[4].avatar : './images/empty_hero_icon.svg'" v-bind:class="{active: (drafts[4].id &&  4 == draftSelectedId )}" v-on:click="drafts[4].id ? draftSelectedId = 4 : ''">
          </div>
        </div>
        <div class="team">
          <div class="name" v-bind:class="{ active: isActiveContent == 1 }">Dire</div>
          <div class="draft">
            <img v-bind:src="drafts[5].id ? drafts[5].avatar : './images/empty_hero_icon.svg'" v-bind:class="{active: (drafts[5].id &&  5 == draftSelectedId )}" v-on:click="drafts[5].id ? draftSelectedId = 5 : ''">
            <img v-bind:src="drafts[6].id ? drafts[6].avatar : './images/empty_hero_icon.svg'" v-bind:class="{active: (drafts[6].id &&  6 == draftSelectedId )}" v-on:click="drafts[6].id ? draftSelectedId = 6 : ''">
            <img v-bind:src="drafts[7].id ? drafts[7].avatar : './images/empty_hero_icon.svg'" v-bind:class="{active: (drafts[7].id &&  7 == draftSelectedId )}" v-on:click="drafts[7].id ? draftSelectedId = 7 : ''">
            <img v-bind:src="drafts[8].id ? drafts[8].avatar : './images/empty_hero_icon.svg'" v-bind:class="{active: (drafts[8].id &&  8 == draftSelectedId )}" v-on:click="drafts[8].id ? draftSelectedId = 8 : ''">
            <img v-bind:src="drafts[9].id ? drafts[9].avatar : './images/empty_hero_icon.svg'" v-bind:class="{active: (drafts[9].id &&  9 == draftSelectedId )}" v-on:click="drafts[9].id ? draftSelectedId = 9 : ''">
          </div>
        </div>
        <div class="draftHeroInfo" v-if="draftSelectedId >= 0">
          <div class="draftAnalisysTotal">
            <div class="totalTeam">Radiant [{{ draftTotalRadiant }}%]</div>
            <div class="totalTeam dire">Dire [{{ 100 - draftTotalRadiant }}%]</div>
            <div class="total radiant" v-bind:class="{ win: draftTotalRadiant >= 50 }" v-bind:style="{width: draftTotalRadiant+'%'}"></div>
            <div class="total dire" v-bind:class="{ win: draftTotalRadiant <= 50 }" v-bind:style="{width: 100 - draftTotalRadiant+'%'}"></div>
          </div>
          <img v-bind:src="drafts[draftSelectedId].avatar" alt="">
          <div class="name">
            {{  drafts[draftSelectedId].name }}
            <span> [{{ drafts[draftSelectedId].winrate }}%]</span><br>
            <span v-for="role in drafts[draftSelectedId].roles">
              {{ role }}
            </span>
          </div>
          <div class="clearDraft" v-on:click="clear()">{{ locale('Clear') }}</div><br>
          <div class="counter">
            <h4>{{ locale('Counter') }}</h4>
             <div v-for="counter in drafts[draftSelectedId].counter" class="hero">
                 <img v-bind:src="heroes.find(hero => hero.id === counter.id).avatar">
                <span>{{ heroes.find(hero => hero.id === counter.id).name + ' [' + counter.winrateAgainst }}%]</span>
            </div>
          </div>
          <div class="counter">
            <h4>{{ locale('CounterThis') }}</h4>
             <div v-for="counterThis in drafts[draftSelectedId].counterThis" class="hero">
                <img v-bind:src="heroes.find(hero => hero.id === counterThis.id).avatar">
                <span>{{ heroes.find(hero => hero.id === counterThis.id).name + ' [' + counterThis.winrateAgainst }}%]</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    <div v-bind:class="{ active: isActiveContent == 1 }">
      <div class="prematchAnalisysStats" v-if="playersInfo">
        <div class="table header">
          <div>{{ locale('Name') }}</div>
          <div>{{ locale('Rank') }}</div>
          <div class="center">{{ locale('Most popular heroes') }}</div>
          <div>{{ locale('Links') }}</div>
        </div>
        <div class="table">
          <div class="left no-border">{{ 'Radiant' }}</div>
        </div>
          <div class="table" v-for="n in 5">
            <div> <img v-bind:src="playersInfo[n - 1].avatar"> {{ playersInfo[n - 1].name }}</div>
            <div>{{ playersInfo[n - 1].rank + ' [' + playersInfo[n - 1].rmm + ']' }}</div>
            <div class="center">
              <img v-for="heroPlayer in playersInfo[n - 1].heroes" v-bind:src="heroes.find(hero => hero.id === parseInt(heroPlayer.id)).avatar">
            </div>
            <div><div class="link" v-on:click="openLink('https://www.opendota.com/players/' + playersInfo[n - 1].id)">Opendota</div></div>
          </div>
          <div class="table">
          <div class="left no-border">{{ 'Dire' }}</div>
        </div>
        <div class="table" v-for="n in 5">
            <div> <img v-bind:src="playersInfo[n + 4].avatar"> {{ playersInfo[n + 4].name }}</div>
            <div>{{ playersInfo[n + 4].rank + ' [' + playersInfo[n + 4].rmm + ']' }}</div>
            <div class="center">
              <img v-for="heroPlayer in playersInfo[n + 4].heroes" v-bind:src="heroes.find(hero => hero.id === parseInt(heroPlayer.id)).avatar">
            </div>
            <div><div class="link" v-on:click="openLink('https://www.opendota.com/players/' + playersInfo[n + 4].id)">Opendota</div></div>
          </div>
      </div>
      <div v-on:click="openTotals()" class="prematchAnalisysOpenTotals">
        <div v-bind:class="{ active: isActiveTotals }">{{ locale('Totals') }}</div>
      </div>
        <div v-bind:class="{ active: isActiveTotals }" class="prematchAnalisysTotals" v-if="playersInfo">
          <div class="table header">
            <div class="center">{{ locale('Efficiency') }}</div>
            <div class="center">{{ locale('KDA') }}</div>
            <div class="center">{{ locale('GPM') }}</div>
            <div class="center">{{ locale('XPM') }}</div>
            <div class="center">{{ locale('Damage') }}</div>
            <div class="center">{{ locale('Healing') }}</div>
          </div>
          <div class="table">
            <div class="left no-border">{{ locale('Totals') }}</div>
          </div>
          <div class="table" v-for="n in 5">
            <div class="center"  v-bind:class="{ max: isMax(0, playersInfo[n - 1].totals[0].efficiency) }" >{{ playersInfo[n - 1].totals[0].efficiency }}</div>
            <div class="center"  v-bind:class="{ max: isMax(1, playersInfo[n - 1].totals[0].kda) }" >{{ playersInfo[n - 1].totals[0].kda }}</div>
            <div class="center"  v-bind:class="{ max: isMax(2, playersInfo[n - 1].totals[0].gpm) }" >{{ playersInfo[n - 1].totals[0].gpm }}</div>
            <div class="center"  v-bind:class="{ max: isMax(3, playersInfo[n - 1].totals[0].xpm) }" >{{ playersInfo[n - 1].totals[0].xpm }}</div>
            <div class="center"  v-bind:class="{ max: isMax(4, playersInfo[n - 1].totals[0].damage) }" >{{ playersInfo[n - 1].totals[0].damage }}</div>
            <div class="center"  v-bind:class="{ max: isMax(5, playersInfo[n - 1].totals[0].healing) }" >{{ playersInfo[n - 1].totals[0].healing }}</div>
          </div>
          <div class="table">
            <div class="left no-border">{{ locale('Totals') }}</div>
          </div>
          <div class="table" v-for="n in 5">
            <div class="center" v-bind:class="{ max: isMax(0, playersInfo[n + 4].totals[0].efficiency) }">{{ playersInfo[n + 4].totals[0].efficiency }}</div>
            <div class="center" v-bind:class="{ max: isMax(1, playersInfo[n + 4].totals[0].kda) }">{{ playersInfo[n + 4].totals[0].kda }}</div>
            <div class="center" v-bind:class="{ max: isMax(2, playersInfo[n + 4].totals[0].gpm) }">{{ playersInfo[n + 4].totals[0].gpm }}</div>
            <div class="center" v-bind:class="{ max: isMax(3, playersInfo[n + 4].totals[0].xpm) }">{{ playersInfo[n + 4].totals[0].xpm }}</div>
            <div class="center" v-bind:class="{ max: isMax(4, playersInfo[n + 4].totals[0].damage) }">{{ playersInfo[n + 4].totals[0].damage }}</div>
            <div class="center" v-bind:class="{ max: isMax(5, playersInfo[n + 4].totals[0].healing) }">{{ playersInfo[n + 4].totals[0].healing }}</div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'content',
  props: []
}
</script>
