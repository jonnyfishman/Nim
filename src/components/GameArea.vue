<template>
  <article>
    <header>
      <h1>Nim</h1>
      <p>This is a strategy game. The aim is to force you component to reach the number 21. Each player can add on 1 2 or 3 to the total.</p>
      <slot></slot>
    </header>
    <section
      v-for="(section) in sections"
      :key="section"
      class="game"
    >
      <h2>{{ section.h2 }}</h2>
      <p>{{ section.p }} <span class="fade-in" v-if="section.span">{{ this.getStrategy }}</span></p>
      <fieldset :class="section.class">
        <button
          @click="nextMove(button.func ? button.func : {})"
          v-for="(button, index) in section.buttons"
          :class="button.class"
          :key="index"
          class="btn"
        >
          {{ button.text }}
        </button>
      </fieldset>
    </section>

    <section id="total">
      <h2>Total</h2>
      <p>The total is now <span>{{ runningTotal }}</span></p>
    </section>
  </article>
</template>

<script>
export default {
  emits: ['emitter'],
  data () {
    return {
      sections: [
        {
          h2: 'Begin Game',
          p: 'Choose which player will start to begin.',
          class: 'column',
          buttons: [
            {
              text: 'COMPUTER',
              class: 'player',
              func: {
                player: 2
              }
            },
            {
              text: 'YOU',
              class: 'player',
              func: {
                player: 1
              }
            }
          ]
        },
        {
          h2: 'Your Turn...',
          p: 'Choose how much to add on.',
          class: 'row',
          buttons: [
            {
              text: '1',
              class: 'choice',
              func: {
                addToTotal: 1
              }
            },
            {
              text: '2',
              class: 'choice',
              func: {
                addToTotal: 2
              }
            },
            {
              text: '3',
              class: 'choice',
              func: {
                addToTotal: 3
              }
            }
          ]
        },
        {
          h2: 'Computers Turn...',
          p: 'The computer has chosen...',
          span: true,
          class: 'row',
          buttons: [
            {
              text: 'CONTINUE',
              class: 'player'
            }
          ],
          timeout: 3
        }
      ],
      runningTotal: 0,
      playerToStart: 1,
      timeout: null
    }
  },
  props: {
    targetNumber: Number,
    strategy: Object
  },
  watch: {
    strategy (strategy) {
      if (strategy.length > 0 && this.runningTotal > 0) {
        // console.log(this.sections.splice(this.sections.length - 1, 1)[0])
        this.reset()
      }
    },
    runningTotal (runningTotal) {
      this.$emit('emitter', runningTotal)
    }
  },
  computed: {
    getStrategy () {
      return !this.strategy[this.runningTotal] ? this.getRandomInt(1, 3) : +this.strategy[this.runningTotal][0][0]
    }
  },
  methods: {
    nextMove (func = {}) {
      clearTimeout(this.timeout)

      if (func.player) { // assume start of play
        this.playerToStart = func.player
        this.sections.splice(1, 0, this.sections.splice(func.player, 1)[0]) // move the players choice to index 1
        this.sections.splice(this.sections.length, 0, this.sections.shift()) // move the first position to the end
        if (func.player === 2) {
          this.timeout = setTimeout(() => {
            this.nextMove()
          }, 3000)
        }
      } else if (func.addToTotal) { // assume players go
        if (this.runningTotal + func.addToTotal >= this.targetNumber) {
          this.endGame('Lose')
          return
        }
        this.runningTotal += func.addToTotal
        this.moveToEnd()
        this.timeout = setTimeout(() => {
          this.nextMove()
        }, 3000)
      } else { // assume computers go
        if (this.runningTotal + this.getStrategy >= this.targetNumber) {
          this.endGame('Win')
          return
        }
        this.runningTotal += this.getStrategy
        this.moveToEnd()
      }
    },
    moveToEnd () {
      this.sections.splice(-1, 0, this.sections.shift()) // move the first position to nth - 1 position
    },
    reset () {
      this.runningTotal = 0
      this.sections.splice(0, 0, this.sections.splice(this.sections.length - 1, 1)[0])
    },
    endGame (result) {
      this.$emit('emitter', `You ${result}!`)
      this.reset()
    },
    getRandomInt (min, max) { // mixin?
      return Math.floor(Math.random() * (1 + max - min) + min)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  section.game {
    flex: 1 1  auto;
    margin-top:1em;
    display:none
  }

  #total {
    display:block;
    flex: 0 0 auto;
  }
  section.game:first-of-type {
    display:block;
  }

  span.fade-in {
    animation: fadeIn 2s;
    font-size:1.6em;
  }
  #total span {
    font-size:1.6em;
  }
  @keyframes fadeIn {
    0% { opacity: 0; }
    20% { opacity: 0.7 }
    40% { opacity: 0.25 }
    60% { opacity: 0.8 }
    80% { opacity: 0.5 }
    100% { opacity: 1; }
  }
</style>
