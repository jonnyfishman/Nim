<template>
  <main>
    <aside class="help" v-if="showHelp">
      <button class="toggle-help" @click="showHelp = !showHelp">X</button>
      <h1>What's going on?</h1>
      <p>The AI is given three strategies to play the game:</p>

      <ul>
        <li>Where possible, jump on a small amount to have more goes.</li>
        <li>Add a number to the total to make it even.</li>
        <li>When within 3 of the target number, always jump on 1.</li>
      </ul>

      <p>It then plays against itself for a given number of iterations. The moves of the succesful player are recorded and used to influence the AI's choices when you played against it (this is known as reinforcement learning).</p>
      <p>The greater number of iterations the more secure the AI gets at choosing the best number to add on. <em>Try turning down the number of iterations to see the affect it has on your ability to beat the AI.</em></p>

      <p>N.b The strategy for this game is very basic and as a result the AI never makes certain choices. This is why the AI doesn't have a probability for certain totals.</p>
    </aside>
    <game-area
      :target-number="targetNumber"
      :strategy="strategy"
      @emitter="gameEmitter"
      class="game-area"
    >
      <button class="toggle-help" @click="showHelp = !showHelp">How to play</button>
    </game-area>
    <game-config
      :target-number="targetNumber"
      @emitter="configEmitter"
      :running-total="runningTotal"
      class="game-config"
    ></game-config>
  </main>
  <modal-container
    v-if="isModal"
    :modal="modal"
    @closeModal="closeModal"
  ></modal-container>
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
      runningTotal: 0,
      showHelp: false,
      modal: {
        state: false,
        text: null
      }
    }
  },
  computed: {
    isModal () {
      return this.modal.state
    }
  },
  methods: {
    configEmitter (strategy) {
      this.strategy = strategy
    },
    gameEmitter (emission) {
      if (typeof emission === 'string') {
        this.showModal(emission)
      } else {
        this.runningTotal = emission
      }
    },
    closeModal () {
      this.modal.state = false
    },
    showModal (text) {
      this.modal.state = true
      this.modal.text = text
    }
  }
}
// mobile class
// tidy up reptitions
// add mixins for shared functions
</script>

<style>

</style>
