<template>
  <section class="character">
    <div class="container">
      <main class="box content">
        <h1 class="title">{{ character.email }}</h1>
        <h4 class="subtitle">for "{{ campaign.name }}"</h4>
        <ability-scores :stats="character.stats">
          <template slot="after" slot-scope="stat">
            <div v-if="!campaign.fixedOrder && !character.finalized" class="stat--arrows">
              <button 
                v-if="stat.index > 0" 
                class="stat--arrow up"
                @click="move(stat.index, UP)">▲</button>
              <button 
                v-if="stat.index < character.stats.length - 1" 
                class="stat--arrow down"
                @click="move(stat.index, DOWN)">▼</button>
            </div>
            <transition-group name="roll-dice" tag="div" class="stat--dice" appear>
              <div class="stat--die" v-for="(roll, index) in dice[stat.index]" :data-rolled="roll" :key="index"></div>
            </transition-group>
          </template>
          <button 
            slot="empty" 
            slot-scope="stat" 
            class="button is-primary is-outlined stat--roll" 
            @click="roll(stat.index)">Roll!</button>
        </ability-scores>
        <!-- TODO: need a computed value here for non-null stats to only show button when non-fixed-order rolls are complete -->
        <button class="button is-primary is-large" v-if="!campaign.fixedOrder && !character.finalized" @click="finalize">Done!</button>
      </main>
      <aside>
        <campaign-details :campaign="campaign" />
      </aside>
    </div>
  </section>
</template>

<script>
  import AbilityScores from '~/components/AbilityScores.vue'
  import CampaignDetails from '~/components/CampaignDetails.vue'
  import axios from '~/plugins/axios'

  const UP = -1
  const DOWN = 1

  export default {
    components: {
      AbilityScores,
      CampaignDetails
    },
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
      // var dice = (new Array(6)).fill([6, 5, 2, 1])
      var dice = (new Array(6)).fill(new Array(0))
      return {
        dice,
        UP,
        DOWN,
        show: false
      }
    },
    head () {
      return {
        title: `Character: ${this.character.email}`
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

<style lang="scss">
  @import "~assets/css/_colors";
  $roll-time: 200ms;
  
  .roll-dice-enter, .show-stat-enter /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .show-stat-enter-active {
    transition: opacity 0.5s ease-in #{$roll-time * 4}; // ideally, "4" should come from data
  }

  .roll-dice-enter-active {
    transition: opacity 0.5s;
    @for $i from 1 through 4 {  // ideally, "4" should come from data
      &:nth-of-type(#{$i}) {
        transition-delay: #{$roll-time * $i}; 
      }
    }
  }

  .stat--arrows {
    height: 100%;
    position: relative;
    width: 1.25rem;

    .stat--arrow {
      border: 0px;
      background-color: transparent;
      font-size: 1.25rem;
      line-height: 0.85rem;
      outline: 0;
      padding: 0;
      position: absolute;
      &.up {
        top: 0;
      }
      &.down {
        bottom: 0;
      }
    }
  }

  .stat--roll.button.is-primary.is-outlined {
    font-weight: bold;
    background-color: #FFFFFF;
  }

  .stat--dice {
    position: relative;

    .stat--die {
      background-color: $pencil-orange;
      border: 1px solid black;
      border-radius: 2px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 5px;
      height: 2.35rem;
      width: 2.35rem;
      font-size: 1.5rem;
      @media screen and (max-width: 500px) {
        height: 1.4rem;
        width: 1.4rem;
        font-size: 1rem;
      }

      &:before {
        content: attr(data-rolled);
      }

      &:nth-of-type(n+4):after {
        content: 'X';
        color: red;
        font-size: 110%;
        font-weight: bold;
        position: absolute;
        opacity: 0.925;
      }
    }

  }
</style>
