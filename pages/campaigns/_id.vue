<template>
  <section>
    <h1>{{ campaign.name }}</h1>
    <p>{{ campaign.diceCount }}d6<span v-if="campaign.fixedOrder">, fixed order</span></p>
    <ol class="characters">
      <li v-for="character in campaign.characters">
        <span><nuxt-link :to="{ path: '/characters/' + character._id }">{{ character._id }}</nuxt-link></span>
        <span>{{ character.email }}</span>
        <span>{{ character.finalized }}</span>
        <ul v-if="character.finalized">
          <li v-for="stat in character.stats">{{ stat }}</li>
        </ul>
      </li>
    </ol>
  </section>
</template>

<script>
  import axios from '~/plugins/axios'
  export default {
    asyncData ({ params, error }) {
      return axios.get('/api/campaigns/' + params.id)
        .then((res) => {
          return { campaign: res.data }
        })
        .catch((e) => {
          console.error('error', e.message)
          error({ statusCode: 404, message: 'Campaign not found' })
        })
    },
    head () {
      return {
        title: `User: ${this.campaign.name}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .characters li > span {
    display: inline-block;
    & + span {
      padding-left: 10px;
    }
  }
</style>