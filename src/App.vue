<template>
  <main>
    <game-area :target-number="targetNumber" :strategy="strategy" v-on:sendTotal="sendTotal"/>
  </main>
    <aside v-if="hideConfig">
      <game-config :target-number="targetNumber" v-on:sendStrategy="newStrategy" :runningTotal="runningTotal" />
    </aside>

</template>

<script>
import GameArea from '@/components/GameArea.vue'
import GameConfig from '@/components/GameConfig.vue'

export default {
  name: 'App',
  components: {
    GameArea,
    GameConfig
  },
  data () {
    return {
      targetNumber: 21,
      iterations: 10,
      strategy: [],
      runningTotal: 0
    }
  },
  computed: {
    hideConfig () {
      return !this.$route.params.hide
    }
  },
  methods: {
    newStrategy (strategy) {
      this.strategy = strategy
    },
    sendTotal (runningTotal) {
      this.runningTotal = runningTotal
    }
  }
}
// modal end Game
// game area animations
// mobile class
// vue best style check
// tidy up reptitions
// add mixins for shared functions
// explanation visible
// progress bar
// add vuex store
// disable while running
// force scale on probabilities
</script>

<style>
  #app {
    display:flex;

  }
  main {
    flex:1 1 auto;
  }
  aside {
    flex: 0 0 auto;
    width:30vw;
  }
</style>
