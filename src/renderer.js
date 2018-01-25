import Vue from 'vue';
const remote = require('electron').remote;
var window = remote.getCurrentWindow();
const shell = require('electron').shell;

import settingsDefaults from './modules/settings';
const settings = require('electron-settings');
var locales = new(require('./modules/locales'));
import menu from './templates/menu';
import popup from './templates/popup';
import content from './templates/content';
import load from './templates/load';
import draftAnalisys from './modules/draftAnalisys';
import updater from './modules/update';
import analytics from './modules/analytics';
import prematchAnalisys from './modules/prematchAnalisys';

module.exports = {
  theme: settings.get('theme')
}

updater.appUpdater();

const LoadComponent = new Vue({
  el: '#load',
  data: {
    isActive: false
  },
  methods: {
    active: function () {
      this.isActive = !this.isActive;
    }
  },
  render: load.render
});


const MenuComponent = new Vue({

  el: '#menu',
  data: {
      isActivePopup: -1,
      isActiveContent: 0,
      startPrematchAnalisys: true
  },
  methods: {

    showPopup: function(isActiveNum){
      if (PopupComponent.isActive) {
        if (this.isActivePopup == isActiveNum) {
          PopupComponent.isActive = !PopupComponent.isActive;
          this.isActivePopup = -1;
          PopupComponent.content = -1;
        } else {
          PopupComponent.content = isActiveNum;
          this.isActivePopup = isActiveNum;
        }
      } else {
        this.isActivePopup = isActiveNum;
        PopupComponent.content = isActiveNum;
        PopupComponent.isActive = !PopupComponent.isActive;
      }
    },

    showContent: function(isActiveNum){
      if (this.isActiveContent != isActiveNum) {
        this.isActiveContent = isActiveNum;
        ContentComponent.content(isActiveNum);
      }
      if (isActiveNum == 1 && this.startPrematchAnalisys) {
        this.startPrematchAnalisys = false;
        prematchAnalisys.start();
      }

    },

    windowClose: function () {
      window.close();
    },

    windowMinimize: function () {
      window.hide();
    },

    locale: function (string) {
      return locales.__(string);
    }
  },
  render: menu.render
});

const PopupComponent = new Vue({
  el: '#popup',
  data: {
    isActive: false,
    content: -1,
    version: remote.app.getVersion(),
    languagePicked: ""
  },
  methods: {
    closePopup: function(){
      this.isActive = false;
      MenuComponent.isActivePopup = -1;
    },
    change: function(field, string){
      settings.set(field, string);
      if (field == "language" || field == "theme") {
        remote.app.relaunch();
        remote.app.exit(0);
      }
    },
    checked: function(field, string){
      if (settings.get(field) == string) {
        return true;
      } else {
        return false;
      }
    },
    locale: function (string) {
      return locales.__(string);
    },
    openLink: function (link) {
      shell.openExternal(link);
    }
  },
  render: popup.render
});

const ContentComponent = new Vue({
  el: '#content',
  data: {
    isActiveContent: 0,
    heroes: '',
    enteredHeroName: '',
    selectedHeroId: '',
    draftSelectedId: -1,
    drafts: [
      { id: ''},
      { id: ''},
      { id: ''},
      { id: ''},
      { id: ''},
      { id: ''},
      { id: ''},
      { id: ''},
      { id: ''},
      { id: ''}
    ],
    draftTotalRadiant: 50,
    playersInfo: '',
    isActiveTotals: false,
    maxTotals: [0,0,0,0,0,0]
  },
  methods: {
    locale: function (string) {
      return locales.__(string);
    },
    setPlayersInfo: function(data) {
      this.playersInfo = data;
      this.maxTotals = new Array(0,0,0,0,0,0);
    },
    isMax: function(prop, val) {
      if (this.maxTotals[prop] <= parseInt(val)) {
        this.maxTotals[prop] = parseInt(val);
        return true;
      } else {
        return false;
      }
    },
    openTotals: function() {
      this.isActiveTotals = !this.isActiveTotals;
    },
    openLink: function (link) {
      shell.openExternal(link);
    },
    heroSearch: function (name, string) {
      if (name.toLowerCase().includes(string.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    },
    select: function (id) {
      if (this.selectedHeroId != id) {
        this.selectedHeroId = id;
      }
    },
    showHeroStats: function (id) {
      if (this.selectedHeroId != id) {
        this.selectedHeroId = id;
      }
    },
    clear: function () {
      this.enteredHeroName = '';
      this.selectedHeroId = '';
      this.draftSelectedId = -1;
      this.drafts = [
        { id: ''},
        { id: ''},
        { id: ''},
        { id: ''},
        { id: ''},
        { id: ''},
        { id: ''},
        { id: ''},
        { id: ''},
        { id: ''}
      ];
      this.draftTotalRadiant = 50;
    },
    addHero: function (team) {
      for (var i = 0; i < 5; i++) {
        var num = team + i;
        if (!this.drafts[num].id && !this.drafts.find(hero => hero.id === this.selectedHeroId)) {
          this.drafts[num] = this.heroes.find(hero => hero.id === this.selectedHeroId);

          LoadComponent.active();
          draftAnalisys.heroMatchups(this.drafts[num].id).then((matchups) => {
            this.drafts[num].matchups = matchups[0];
            this.drafts[num].winrate = matchups[1];
            this.drafts[num].counter = matchups[2];
            this.drafts[num].counterThis = matchups[3];
            this.draftSelectedId = num;
            this.selectedHeroId = '';

            this.draftTotalRadiant = draftAnalisys.draftAnalisys(this.drafts);

            LoadComponent.active();
          });

          break;
        }
      }
    },
    content: function (isActiveNum) {
      this.isActiveContent = isActiveNum;
    }
  },
  mounted: function () {
      LoadComponent.active();
      draftAnalisys.heroes.then((heroes) => {
        ContentComponent.heroes = heroes;
        LoadComponent.active();
      });
  },
  render: content.render
});

prematchAnalisys.playersInfo = ContentComponent.setPlayersInfo;
prematchAnalisys.load = LoadComponent.active;