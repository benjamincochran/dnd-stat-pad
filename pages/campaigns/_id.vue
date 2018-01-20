<template>
  <main class="section">
    <section class="container box content">
      <h1>{{ campaign.name }}</h1>
      <dl>
        <dt>Dice</dt><dd>{{ campaign.diceCount }}d6</dt>
        <dt>Fixed Order</dt><dd>{{ campaign.fixedOrder }}</dd>
      </dl>
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
  </main>
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