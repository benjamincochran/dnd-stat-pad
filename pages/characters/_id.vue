<template>
  <main>
    <section class="container box content">
      <h1>{{ character.email }}</h1>
      Finalized: {{ character.finalized }}<br/>
      Fixed Order: {{ fixedOrder }}
      <ul class="stats">
        <li class="stat" v-for="(stat, index) in character.stats">
          <template v-if="stat">
            <span class="stat--text">{{ stat }}</span> 
            <span class="stat--dice" v-if="dice[index].length > 0">{{ dice[index] }}</span>
            <template v-if="!fixedOrder && !character.finalized">
              <button v-if="index > 0" class="stat--move up" @click="move(index, UP)">^</button>
              <button v-if="index < character.stats.length - 1" class="stat--move down" @click="move(index, DOWN)">v</button>
            </template>
          </template>
          <button class="button is-primary" v-else @click="roll(index)">Roll {{ diceCount }}d6!</button>
        </li>
      </ul>
      <button v-if="!fixedOrder && !character.finalized" @click="finalize">Done!</button>
    </section>
  </main>
</template>

<style lang="scss" scoped>
  ul.stats {
    li.stat {
      margin: 7px 0px;
      position: relative;
      .stat--move {
        border: 0px;
        height: 10px;
        line-height: 10px;
        margin-left: 10px;
        outline: 0;
        padding: 0px;
        position: absolute;
        &.up {
          top: 0px;
        }
        &.down {
          bottom: 0px;
        }
      }
    }
  }
</style>

<script>
  import axios from '~/plugins/axios'

  const UP = -1
  const DOWN = 1

  export default {
    asyncData ({ params, error }) {
      return axios.get('/api/characters/' + params.id)
        .then((res) => {
          return res.data
        })
        .catch((e) => {
          console.error(e.message)
          error({ statusCode: 404, message: 'Character not found' })
        })
    },
    data () {
      return {
        dice: (new Array(6)).fill(new Array(0)),
        UP,
        DOWN
      }
    },
    methods: {
      roll (index) {
        axios.post('/api/characters/' + this.character._id + '/roll', { index })
          .then((response) => {
            this.character.stats.splice(index, 1, response.data.stat)
            this.dice.splice(index, 1, response.data.dice)
            this.character.finalized = response.data.finalized
          })
          .catch((e) => {
            console.error(e.message)
          })
      },
      move (index, dir) {
        if ((index === 0 && dir === UP) || (index === (this.character.stats.length - 1) && dir === DOWN)) {
          console.error('no')
          return
        }
        this.character.stats.splice(index, 0, this.character.stats.splice(index + dir, 1)[0])
        this.dice.splice(index, 0, this.dice.splice(index + dir, 1)[0])
        axios.post('/api/characters/' + this.character._id + '/arrange', {
          stats: this.character.stats
        })
          .then((response) => {
            console.log('arranged', response)
          })
          .catch((e) => {
            console.error(e.message)
          })
      },
      finalize () {
        this.character.finalized = true
        axios.post('/api/characters/' + this.character._id + '/finalize')
          .then((response) => {
            console.log('finalized', response)
          })
          .catch((e) => {
            console.error(e.message)
          })
      }
    }
  }
</script>