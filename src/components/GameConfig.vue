<template>
<section>
  <h1>Config</h1>
  <label for="iterations">Iterations: </label>
  <input name="iterations" type="text" maxlength="3" size="3" v-model="iterations"/>
  <button @click="simulate()">RUN SIMULATION</button>
  <h4>Progress</h4>
  <vue3-progress-bar />
</section>
<section>
  <h2>Total</h2>
  <p>The larger the circle the better it is.</p>
  <ol v-if="strategy.length > 0" start="0">
    <li v-for="(result, index) in strategy" :key="index" :class="{ empty: !result }">
      <span v-for="(value, key, index) of result" class="bubble" :style="getStyles(value, result)" :key="index">
        {{ key }}
      </span>
    </li>
  </ol>
</section>
</template>

<script>
import { useProgress } from '@marcoschulte/vue3-progress'

export default {
  emits: ['sendStrategy'],
  data () {
    return {
      iterations: 10,
      strategy: [],
      winners: { 1: 0, 2: 0 },
      progress: 0
    }
  },
  props: {
    targetNumber: Number,
    runningTotal: Number
  },
  computed: {
    getProgress () {
      return this.progress + 'px'
    }
  },
  watch: {
    runningTotal (runningTotal) {
      const list = document.querySelectorAll('ol li')
      if (list[runningTotal] && runningTotal !== 0) {
        list[runningTotal].classList.add('highlight')
        list[runningTotal].scrollIntoView({ behavior: 'smooth' })
        setTimeout(() => {
          list[runningTotal].classList.remove('highlight')
        }, 2500)
      }
    }
  },
  methods: {
    simulate () {
      async () => {
        this.strategy = []
        for (let x = 0; x < this.iterations; x++) {
          this.progress = x / 2
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
        }
        // console.log('Record of winning results [total at start of go] {number played}')
        // console.log(this.strategy)
        // console.log('Total number of wins for each player')
        // console.log(this.winners)
        this.progress = 0
        this.$emit('sendStrategy', this.strategy)
        return true
      }

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
        if (!this.strategy[i]) this.strategy[i] = { 1: 0, 2: 0, 3: 0 }

        this.strategy[i][item]++
      })
    },
    getRandomInt (min, max) {
      return Math.floor(Math.random() * (1 + max - min) + min)
    },
    getStyles (prob, arr) {
      return { outlineWidth: (prob / Object.values(arr).reduce((a, b) => a + b)).toFixed(2) + 'em', color: (prob > 0) ? '#fff' : 'inherit', backgroundColor: (prob > 0) ? '#0d5460' : 'none' }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  section {
    padding:2em;
    flex: 1 1 auto;
    background: #f2f2f2;
  }
  section h2, ul {
    color: #0d5460;
  }
  section:nth-child(1) {
    color:#fff;
    background: #0d5460;
    flex: 0 0 auto;
  }
  ol {
    padding:0;
    color: #0d5460;
    list-style-position: inside;
  }
  li.empty:after {
    content: '...';
    color: #666;
    font-size: 1.4em;
    margin-left: 2.4rem;
    vertical-align: middle;
    display: inline-flex;
  }
  li {
    font-size:1.4em;
    padding:1em 0;
    background:none;
    transition:background 2s;
    height:100%;
    padding-left:1em;
    padding-right:1em;
  }
  li.highlight {
    background:rgba(255, 233, 0, 0.6);
    border-radius:5px;
  }

  .progress-bar {
    background:rgba(255,255,255,0.4);
    height:4px;
    width:100%;
  }
  .progress {
    width:63%;
    background:#fff;
    height:100%;
  }

  .bubble {
    width: 2.4em;
    height: 2.4em;
    margin:0;
    margin-left:calc(25% - 2.5em);
    display: inline-flex;
    text-align: center;
    border-radius: 50%;
    flex: 0 0 auto;
    justify-content: center;
    flex-direction: column;
    outline-color: #0d5460;
    outline-style:solid;
    outline-offset: -2px;
    font-size:1rem;
  }
</style>
