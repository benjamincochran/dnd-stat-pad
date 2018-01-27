<template>
  <section class="campaign">
    <div class="container">
      <main class="box content">
        <h1>{{ campaign.name }}</h1>
        <p>
          This is the hub page for your campaign.  You may want to bookmark it, since it will be extremely difficult to recover if you lose the URL.
        </p>
        <h3>Characters</h3>
        <div class="characters is-non-content">
          <div v-for="character in campaign.characters" class="character card">
            <header class="card-header">
              <nuxt-link :to="{ path: '/characters/' + character._id }" class="card-header-title">{{ character.email }}</nuxt-link>
            </header>
            <ability-scores 
              :class="{'card-content': true, 'is-faded': !character.finalized}" 
              :stats="character.finalized ? character.stats : emptyStats" />
            <footer class="card-footer">
              <a @click=comingSoon class="card-footer-item" target="_blank">Resend Email</a>
              <a @click=comingSoon class="card-footer-item">Grant Re-roll</a>
            </footer>
          </div>
        </div>
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
    data () {
      return {
        emptyStats: (new Array(6)).fill('?')
      }
    },
    head () {
      return {
        title: `Campaign: ${this.campaign.name}`
      }
    },
    methods: {
      comingSoon () {
        this.$toast.open({
          message: 'Coming in a future release',
          type: 'is-dark'
        })
      }
    }
  }
</script>

<style lang="scss">
  .characters {
    &:after {
      display: block;
      content: ' ';
      clear: both;
    }

    .character {
      float: left;
      margin: 0 1% 2%;
      width: 48%;

      .stats {
        display: flex;
        flex-flow: row wrap;
        margin: 0;
        font-size: 75%;
        
        .stat {
          flex-basis: 33%;
        }

        &.is-faded {
          .stat--icon {
            opacity: 0.4;
          }
          .stat--text {
            opacity: 0.6;
          }
        }
      }

    }
  }
</style>