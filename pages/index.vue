<template>
  <section class="homepage">
    <div class="container box content">
      <h1>D&amp;D Stat Pad</h1>
      <p>
        D&amp;D Stat Pad is a DM's tool that lets your players roll legitimate, random ability scores for new characters, even if you can't be there to see them do it.
      </p>
      <p>
        All party members will get an email with an individualized link that will let them
        generate and (at your discretion) arrange ability scores, once and only once.
        You can track their completed rolls on a page that only you will have access to.
      </p>
    </div>
    <form class="container box" @submit.prevent="onSubmit">
      <div class="content">
        <h2>Kick off a new campaign!</h2>
      </div>
      <b-message type="is-danger" v-if="errors.length">
        <p v-for="error in errors">{{ error }}</p>
      </b-message>
      <b-field label="Name your campaign">
        <b-input type="text" placeholder="Ben's Totally Unique Setting" v-model="name" />
      </b-field>
      <b-field label="Enter your players' emails">
        <b-taginput
            v-model="emails"
            type="is-primary"
            placeholder="foo@bar.com"
            maxlength="50"
            maxtags="9">
        </b-taginput>
      </b-field>
      <div class="label">Settings</div>
      <b-field grouped class="settings">
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
        <b-field>
          <b-switch v-model="rerollOnes">
            Reroll 1s
          </b-switch>
        </b-field>
      </b-field>
      <b-field position="is-centered">
        <button :class="{button: true, 'is-primary': true, 'is-large': true, 'is-loading': submitting}" type="submit">Go!</button>
      </b-field>
    </form>
  </section>
</template>

<script>
  import axios from '~/plugins/axios'

  export default {
    data () {
      return {
        diceCount: 4,
        emails: [],
        fixedOrder: false,
        rerollOnes: false,
        name: null,
        errors: [],
        submitting: false
      }
    },
    head () {
      return {
        title: 'Generate A New Campaign'
      }
    },
    methods: {
      onSubmit () {
        this.errors = []
        this.submitting = true
        axios.post('/api/campaigns', {
          emails: this.emails,
          diceCount: this.diceCount * 1,
          fixedOrder: this.fixedOrder,
          rerollOnes: this.rerollOnes,
          name: this.name
        })
          .then((response) => {
            this.submitting = false
            this.$nuxt.$router.replace({ path: '/campaigns/' + response.data.id })
          })
          .catch((error) => {
            this.submitting = false
            Object.values(error.response.data.error.errors).map((err) => {
              if (err.message) {
                this.errors.push(err.message)
              }
            })
          })
      }
    }
  }
</script>

<style lang="scss">
  .settings {
    display: flex;
    align-items: center;

    & > .field {
      margin-bottom: 0;
    } 
  }
</style>
