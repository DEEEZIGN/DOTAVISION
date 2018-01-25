<template>
  <div class="menu">
    <div>Dotavision</div>
    <div v-on:click="showContent(0)" v-bind:class="{ active: isActiveContent == 0 }">{{ locale('Draft analisys') }}</div>
    <div v-on:click="showContent(1)" v-bind:class="{ active: isActiveContent == 1 }">{{ locale('Pre-match analisys') }}</div>
    <div v-on:click="showPopup(0)" v-bind:class="{ active: isActivePopup == 0 }">{{ locale('Settings') }}</div>
    <div v-on:click="showPopup(1)" v-bind:class="{ active: isActivePopup == 1 }">{{ locale('About') }}</div>
    <div v-on:click="windowClose()"></div>
    <div v-on:click="windowMinimize()"></div>
  </div>
</template>

<script>
export default {
  name: 'menu',
  props: []
}
</script>
