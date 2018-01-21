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
      <aside class="box content">
        <h3>Settings</h3> 
        <dl>
          <dt>Dice</dt><dd>{{ campaign.diceCount }}d6</dd>
          <dt>Fixed Order</dt><dd>{{ campaign.fixedOrder }}</dd>
        </dl>
        <h3>Time Remaining</h3>
        <dl>
          <dt>Created</dt><dd>{{ campaign.created }}</dd>
          <dt>Expires</dt><dd>{{ campaign.expires }}</dd>
        </dl>
      </aside>
    </div>
  </section>
</template>

<script>
  import AbilityScores from '~/components/AbilityScores.vue'
  import axios from '~/plugins/axios'
  import moment from 'moment'

  const DFMT = 'M/D/YY h:mm A'

  export default {
    components: {
      AbilityScores
    },
    asyncData ({ params, error }) {
      return axios.get('/api/campaigns/' + params.id)
        .then((res) => {
          var campaign = res.data
          var createdDate = moment(campaign.created)
          campaign.created = createdDate.format(DFMT)
          campaign.expires = createdDate.add(14, 'days').format(DFMT)
          return { campaign }
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

        dl {
          display: flex;
          flex-wrap: wrap;
          
          dt {
            font-weight: bold;
            width: 40%;
          }
          dd {
            text-align: right;
            margin-left: auto;
            width: 60%;
          }
        }

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