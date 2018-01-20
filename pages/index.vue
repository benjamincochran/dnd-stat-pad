<template>
  <main class="section">
    <section class="container box content">
      <h1>D&amp;D Stat Pad</h1>
      <p>
        D&amp;D Stat Pad is a DM's tool that lets your players honestly roll up new 
        characters, even if your party can't all get together before your first game.
      </p>
      <p>
        All party members will get an email with an individual, one-time-use link that
        lets them generate and (at your discretion) arrange ability scores.  You can see
        all completed score arrays on a page that only you will have access to.
      </p>
    </section>
    <form class="container box" @keyup.enter.prevent="false">
      <div class="content">
        <h2>Kick off a new campaign!</h2>
      </div>
      <b-message type="is-danger" v-if="errors.length">
        {{ errors }}
      </b-message>
      <b-field label="Name your campaign">
        <b-input type="text" placeholder="Ben's Totally Unique Setting" v-model="name" required />
      </b-field>
      <b-field label="Enter your players' emails">
        <b-taginput
            v-model="emails"
            type="is-primary"
            placeholder="foo@bar.com"
            required
            maxlength="50"
            maxtags="9">
        </b-taginput>
      </b-field>
      <b-field>
        <b-select v-model="diceCount">
          <option value="3">3</option>
          <option value="4">4</option>
        </b-select>
        <p class="control">
          <span class="button is-static">d6</span>
        </p>
      </b-field>
      <b-field>
        <b-switch v-model="fixedOrder">
          Fixed Order
        </b-switch>
      </b-field>
      <b-field position="is-centered">
        <button class="button is-primary is-large" v-on:click.prevent="onSubmit">Go!</button>
      </b-field>
    </form>
  </main>
</template>

<script>
  import axios from '~/plugins/axios'

  export default {
    data () {
      return {
        diceCount: 4,
        emails: [],
        fixedOrder: false,
        name: null,
        errors: []
      }
    },
    head () {
      return {
        title: 'Generate A New Campaign'
      }
    },
    methods: {
      onSubmit () {
        axios.post('/api/campaigns', {
          emails: this.emails,
          diceCount: this.diceCount * 1,
          fixedOrder: this.fixedOrder,
          name: this.name
        }).then((response) => {
          console.log(response.data.id)
          this.$nuxt.$router.replace({ path: '/campaigns/' + response.data.id })
        }).catch((response) => {
          console.log('badness!', response)
          /* this.errors = Object.values(response.error.errors).map((err) => {
            return err.message
          }) */
        })
      }
    }
  }
</script>

<style lang="scss" scoped="true">
  
</style>
