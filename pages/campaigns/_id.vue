<template>
  <section>
    <div class="container">
      <main class="box content">
        <h1>{{ campaign.name }}</h1>
        <p>
          This is the hub page for your campaign.  You may want to bookmark it, since it will be extremely difficult to recover if you lose the URL.
        </p>
        <h3>Characters</h3>
        <ol class="characters">
          <li v-for="character in campaign.characters" class="card">
            <span><nuxt-link :to="{ path: '/characters/' + character._id }">{{ character._id }}</nuxt-link></span>
            <span>{{ character.email }}</span>
            <span>{{ character.finalized }}</span>
            <ability-scores v-if="character.finalized" :stats="character.stats"/>
          </li>
        </ol>
      </main>
      <campaign-details :campaign="campaign" />
    </div>
  </section>
</template>

<script>
  import AbilityScores from '~/components/AbilityScores.vue'
  import CampaignDetails from '~/components/CampaignDetails.vue'
  import axios from '~/plugins/axios'

  export default {
    components: {
      AbilityScores,
      CampaignDetails
    },
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
        title: `Campaign: ${this.campaign.name}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .section {
    position: relative;

    .container {
      display: flex;
      position: relative;

      main {
        width: 70%;
        margin-right: 5%;
      }

      aside {
        width: 25%;
      }

    }
  }

  .characters li > span {
    display: inline-block;
    & + span {
      padding-left: 10px;
    }
  }
</style>