<template>
  <section>
    <h1>{{ character.email }}</h1>
    Finalized: {{ character.finalized }}
    <ul>
      <li v-for="(stat, index) in character.stats">
        <span v-if="stat">
          {{ stat }} 
          <span v-if="dice[index].length > 0">{{ dice[index] }}</span>
        </span>
        <button v-else @click="roll(index)">Roll {{ diceCount }}d6!</button>
      </li>
    </ul>
  </section>
</template>

<script>
  import axios from '~/plugins/axios'
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
        dice: (new Array(6)).fill(new Array(0))
      }
    },
    methods: {
      roll (index) {
        axios.post('/api/characters/' + this.character._id + '/roll', { index })
          .then((response) => {
            this.character.stats.splice(index, 1, response.data.stat)
            this.dice.splice(index, 1, response.data.dice)
            this.character.finalized = response.data.finalized
          }).catch((e) => {
            console.error(e.message)
          })
      }
    }
  }
</script>