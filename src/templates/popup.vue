<template>
  <div class="popup" v-bind:class="{ active: isActive }">
    <div class="popup-helper" v-on:click.self="closePopup()">
      <div class="popup-content">

        <div v-if="content == 0">
          <h4>{{ locale('Global') }}</h4>
          <p>
            <span>{{ locale('Language') }}:</span>
            <input type="radio" name="language" :checked="checked('language','en')" v-on:click="change('language','en')" id="language-0"><label for="language-0">{{ locale('English') }}</label>
            <input type="radio" name="language" :checked="checked('language','ru')" v-on:click="change('language','ru')" id="language-1"><label for="language-1">{{ locale('Russian') }}</label>
          </p>
          <p>
            <span>{{ locale('Theme') }}:</span>
            <input type="radio" name="theme" :checked="checked('theme','default')" v-on:click="change('theme','default')" id="theme-0"><label for="theme-0">{{ locale('Default') }}</label>
            <input type="radio" name="theme" :checked="checked('theme','dark')" v-on:click="change('theme','dark')" id="theme-1"><label for="theme-1">{{ locale('Dark') }}</label>
            <input type="radio" name="theme" :checked="checked('theme','red')" v-on:click="change('theme','red')" id="theme-2"><label for="theme-2">{{ locale('Red') }}</label>
          </p>
          <h4>{{ locale('Pre-match analisys') }}</h4>
          <p>
            <span>{{ locale('Most popular heroes for') }}:</span>
            <input type="radio" name="mostPopularHeroes" :checked="checked('mostPopularHeroes','0')" v-on:click="change('mostPopularHeroes','0')" id="mostPopularHeroes-0"><label for="mostPopularHeroes-0">{{ locale('All time') }}</label>
            <input type="radio" name="mostPopularHeroes" :checked="checked('mostPopularHeroes','90')" v-on:click="change('mostPopularHeroes','90')" id="mostPopularHeroes-1"><label for="mostPopularHeroes-1">{{ locale('3 months') }}</label>
            <input type="radio" name="mostPopularHeroes" :checked="checked('mostPopularHeroes','30')" v-on:click="change('mostPopularHeroes','30')" id="mostPopularHeroes-2"><label for="mostPopularHeroes-2">{{ locale('1 month') }}</label>
          </p>
          <p>
            <span>{{ locale('Totals for') }}:</span>
            <input type="radio" name="totals" id="totals-0" :checked="checked('totals','0')" v-on:click="change('totals','0')"><label for="totals-0">{{ locale('All games') }}</label>
            <input type="radio" name="totals" id="totals-1" :checked="checked('totals','50')" v-on:click="change('totals','50')"><label for="totals-1">{{ locale('50 games') }}</label>
            <input type="radio" name="totals" id="totals-2" :checked="checked('totals','20')" v-on:click="change('totals','20')"><label for="totals-2">{{ locale('20 games') }}</label>
          </p>
        </div>

        <div v-if="content == 1">
          <h4>Dotavision {{ version }}</h4>
          <p>{{ locale('AboutApp') }}</p>
          <div class="link" v-on:click="openLink('https://www.donationalerts.ru/c/deeezign')">{{ locale('Donate') }}</div>
          <div class="link" v-on:click="openLink('https://dotavision.com/')">dotavision.com</div>
          <div class="link" v-on:click="openLink('https://github.com/DEEEZIGN/DOTAVISION')">github.com</div>
          <div class="link" v-on:click="openLink('https://vk.com/dota_vision')">vk.com</div>
          <h4>{{ locale('Thanks for help') }}</h4>
          <div class="link" v-on:click="openLink('https://github.com/zaerl')">Zaerl</div>
          <div class="link" v-on:click="openLink('https://github.com/bippum')">Alexa</div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popup'
}
</script>
