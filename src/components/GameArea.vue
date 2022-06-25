<template>
    <h1>Nim</h1>
    <p>This is a strategy game. The aim is to force you component to reach the number 21. Each player can add on 1 2 or 3 to the total.</p>

    <transition-group name="sections">
    <section v-for="(section, index) in sections" :key="section" v-show="index === 0">
      <h2>{{ section.h2 }}</h2>
      <p>{{ section.p }} <span class="fade-in" v-if="section.span">{{ this.getStrategy }}</span></p>
      <fieldset>
        <button @click="nextMove(button.func ? button.func : {})" v-for="(button, index) in section.buttons" :class="button.class" :key="index">
          {{ button.text }}
        </button>
      </fieldset>
    </section>
    </transition-group>

    <section id="total">
      <h2>Total</h2>
      <p>The total is now <span>{{ runningTotal }}</span></p>
    </section>

    <aside id="help">
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
</template>

<script>
export default {
  emits: ['sendTotal'],
  data () {
    return {
      sections: [
        {
          h2: 'Begin Game',
          p: 'Choose which player will start to begin.',
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
      this.$emit('sendTotal', runningTotal)
    }
  },
  computed: {
    getStrategy () {
      return !this.strategy[this.runningTotal] ? this.getRandomInt(1, 3) : +Object.keys(this.strategy[this.runningTotal]).reduce((prev, curr) => this.strategy[this.runningTotal][prev] > this.strategy[this.runningTotal][curr] ? prev : curr)
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
      alert(`You ${result}!`)
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
  #player-choice button {
    width:30%;
    margin:auto 10%;
  }
  #number-choice button {
    width:3em;
    height:3em;
    background:#fe5f55;
    border-radius:1.5em;
    color:#f7f7ff;
    font-size:2em;
  }

  button.player {
    width:30%;
    margin:auto 10%;
  }
  button.choice {
    width:2em;
    height:2em;
    background:#fe5f55;
    border-radius:1.5em;
    color:#f7f7ff;
    font-size:2em;
    margin:1em;
  }

  section {
    flex: 1 1  auto;
    margin-top:1em;
  }

  #total {
    flex: 0 0 auto;
  }
  #help {
    display:none;
  }

  section p span {
    animation: fadeIn 2s;
    font-size:2em;
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
