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
              <a @click=resend(character) class="card-footer-item">Resend Email</a>
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
  import mailTemplates from '~/server/mailer/templates'

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
      },
      resend (character) {
        this.$dialog.confirm({
          message: `If an email was not delivered initially, it may be because the target 
            server is filtering out emails from the DND Stat Pad origin address.  Alternately,
            since this site is still in alpha, it may have reached its daily limit of emails
            that can be sent.  Either way, we recommend that you resend from your personal
            email address.`,
          cancelText: 'No, you send it',
          confirmText: 'OK, I\'ll handle it',
          type: 'is-primary',
          onConfirm: () => {
            var subject = mailTemplates.generateSubject(this.campaign)
            var body = mailTemplates.generateText(character)
            var mailto = encodeURI(`${character.email}?subject=${subject}&body=${body}`)
            window.open(`mailto:${mailto}`, '_blank')
          },
          onCancel: () => {
            axios.post(`/api/characters/${character._id}/invite`)
              .then(() => this.$toast.open({
                message: `Email sent to ${character.email}`,
                type: 'is-dark'
              }))
              .catch((e) => {
                console.error(e)
                this.$toast.open({
                  message: 'Email could not be sent',
                  type: `is-error`
                })
              })
          }
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
      margin: 0 1% 2%;
      @media screen and (min-width: 1024px) {
        float: left;
        width: 48%;
      }

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