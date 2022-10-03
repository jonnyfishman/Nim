<template>
  <aside v-if="hideConfig">
    <section class="config config-top">
      <h1>Config</h1>
      <label for="iterations">Iterations: </label>
      <input name="iterations" type="text" maxlength="3" size="3" v-model="iterations"/>
      <button @click="simulate()" class="btn">RUN SIMULATION</button>
      <h4>Progress</h4>
      <vue3-progress-bar />
    </section>
    <section class="config">
      <h2>Total</h2>
      <p>Numbers with a green background represent the calculated best choice.</p>
      <ul v-if="strategy.running.length > 0">
        <li
          v-for="(result, rTotal) in strategy.cumulative"
          :key="rTotal"
          :class="{ empty: !result }"
        >
            <h4>For a total of {{ rTotal }}</h4>
            <div>
              <span
                v-for="(n, i) in result"
                :class="getClass(result, i)"
                :key="i"
                :title="getProb(i, rTotal)"
                class="options"
              >
                {{ i + 1 }}
              </span>
            </div>
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
// import { useProgress } from '@marcoschulte/vue3-progress'
// use whole object in loop above and use alt for probability (prob / Object.values(arr).sort((a, b) => a + b)).toFixed(2)

export default {
  emits: ['emitter'],
  data () {
    return {
      iterations: 10,
      strategy: {
        running: [],
        cumulative: [],
        probability: []
      },
      winners: { 1: 0, 2: 0 },
      progress: null
    }
  },
  props: {
    targetNumber: Number,
    runningTotal: Number
  },
  watch: {
    runningTotal (runningTotal) {
      const list = document.querySelectorAll('ul li')
      if (list[runningTotal] && runningTotal !== 0) {
        list[runningTotal].classList.add('highlight')
        list[runningTotal].scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => {
          list[runningTotal].classList.remove('highlight')
        }, 2500)
      }
    }
  },
  computed: {
    hideConfig () {
      return !this.$route.params.hide
    }
  },
  methods: {
    simulate () {
      new Promise((resolve, reject) => {
        this.progress = this.$progress.start()
        resolve()
      }).then(() => {
        this.strategy.running = []
        this.strategy.cumulative = []
        for (let x = 0; x < this.iterations; x++) {
          let runningTotal = 0
          let player = this.getRandomInt(1, 2)
          const strategyTemp = { 1: [], 2: [] }

          // console.log('==========Game ' + x + new Array(12 - `${this.iterations}`.length).join('='))
          do {
            const p = this.getStrategy(runningTotal)
            if (runningTotal + p >= this.targetNumber) break
            strategyTemp[player][runningTotal] = p // index should be runningTotal not just increment
            runningTotal += p
            // console.log('Player ' + player + ' adds ' + p)
            // console.log('The total is now ' + runningTotal)
            player = player === 2 ? 1 : 2
          } while (runningTotal <= this.targetNumber)

          player = player === 2 ? 1 : 2
          // console.log('Player ' + player + ' WINS')
          // console.log('=========================')
          this.mapResults(strategyTemp[player])
          this.winners[player]++
          // console.log('Record of winning results [total at start of go] {number played}')
          // console.log(this.strategy)
          // console.log('Total number of wins for each player')
          // console.log(this.winners)
        }
      }).catch(() => {
        // error
      }).then(() => {
        this.$emit('emitter', this.strategy.cumulative)
        this.progress.finish()
      })
    },
    getStrategy (runningTotal) {
      let jump = this.getRandomInt(1, 3)

      if (this.targetNumber - runningTotal <= 3) jump = 1

      while ((runningTotal + jump) % 2 !== 0 && jump < 3) {
        jump++
      }
      return jump
    },
    mapResults (strategyTemp) {
      strategyTemp.forEach((item, i) => {
        if (!this.strategy.running[i]) this.strategy.running[i] = { 1: 0, 2: 0, 3: 0 }

        this.strategy.running[i][item]++
        // work out best solution from { 1: 4, 2: 1, 3: 8 }
        const result = this.strategy.running[i]
        this.strategy.cumulative[i] = Object.entries(result).sort((a, b) => a[1] - b[1]).reverse()

        const entries = Object.values(result)
        const total = entries.reduce((a, b) => a + b)
        this.strategy.probability[i] = Array.from({ length: 3 }).map((e, i) => (entries[i] / total).toFixed(2))
      })
    },
    getRandomInt (min, max) {
      return Math.floor(Math.random() * (1 + max - min) + min)
    },
    getProb (choice, index) {
      return parseInt(this.strategy.probability[index][choice] * 100) + '%'
    },
    getClass (results, index) {
      if (+results[0][0] === index + 1) {
        return 'best'
      } else if (+results[1][0] === index + 1) {
        return 'ok'
      }
      return 'worst'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import "~@marcoschulte/vue3-progress/dist/";
  .vue3-progress-bar-container :deep(.vue3-progress-bar) {
    background-color:#fff;
    height:4px;
  }
  .vue3-progress-bar-container {
    position:relative;
    background-color:rgba(255,255,255,0.4);
    height:4px;
    opacity:1;
    overflow:hidden;
    z-index:10;
  }

  section.config {
    padding:2em;
    flex: 1 1 auto;
    color: #0d5460;
  }
  h1, h2, ul, input {
    color:inherit;
  }

  section.config-top {
    color:#fff;
    background: #0d5460;
    flex: 0 0 auto;
  }
  ul {
    padding:0;
    color: #0d5460;
    list-style: none;
  }
  li div {
    display: inline-flex;
    justify-content: space-between;
    align-content: center;
    top: 0;
    position: relative;
    width: 100%;
  }
  li.empty div:after {
    content: '... No results found...';
    color: #666;
    font-size: 0.8em;
    flex:1 1 auto;
    text-align:center;
  }
  li {
    font-size:1.4em;
    padding:0.5em 0;
    background:none;
    transition:background 2s;
    height:100%;
  }
  li.highlight div {
    background: #E3B505;
    border-radius: 9999px;
    outline: 3px solid #E3B505;
    scroll-margin-top: 50vh;
  }
  li h6 {
    font-weight:normal;
    margin: 0 0 0.4em;
  }
  .options {
    width: 2.4em;
    height: 2.4em;
    margin:0;
    display: inline-flex;
    text-align: center;
    border-radius: 50%;
    flex: 0 0 auto;
    justify-content: center;
    flex-direction: column;
    font-size:1rem;
  }
  .best {
    background-color: #0d5460;
    color:#fff;
  }
  .ok-old {
    background-image: linear-gradient(135deg, #0d5460 16.67%, transparent 16.67%, transparent 50%, #0d5460 50%, #0d5460 66.67%, transparent 66.67%, transparent 100%);
    background-size: 16.97px 16.97px;
    color: #fe5f55;
    font-weight: bold;
  }
</style>
