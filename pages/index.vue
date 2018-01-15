<template>
  <section>
    <input type="text" placeholder="Kick off a new Campaign" v-model="name" required tabindex="1" />
    <fieldset>
      <legend>Enter email addresses for your party</legend>
      <ol>
        <li v-for="(email, index) in emails">
          <input type="email" placeholder="Email address" 
            v-model=email.value 
            @keyup.enter="addEmail(index+1)"
            @keyup.esc="removeEmail(index)" 
            :tabindex="index+2" />
          <button @click.prevent="removeEmail(index)">-</button>
        </li>
      </ol>
      <button @click.prevent="addEmail(null)">+</button>
    </fieldset>
    <fieldset>
      <legend>Settings</legend>
      <div>
        <select v-model="diceCount">
          <option>3</option>
          <option>4</option>
        </select>
        <span>d6</span>
      </div>
      <label>
          <input type="checkbox" v-model="fixedOrder" />Fixed order
      </label>
    </fieldset>
    <button v-on:click.prevent="onSubmit">Go!</button>
  </section>
</template>

<script>
  import axios from '~/plugins/axios'
  const EMPTY_EMAIL = () => { return {value: ''} }

  export default {
    data () {
      return {
        diceCount: 4,
        emails: [EMPTY_EMAIL()],
        fixedOrder: true,
        name: null
      }
    },
    head () {
      return {
        title: 'Generate New Campaign'
      }
    },
    methods: {
      onSubmit () {
        axios.post('/api/campaigns', {
          emails: this.emails.filter((e) => {
            return !!e.value || e.value !== ''
          }).map((e) => {
            return e.value
          }),
          diceCount: this.diceCount * 1,
          fixedOrder: this.fixedOrder,
          name: this.name
        }).then((response) => {
          this.$nuxt.$router.replace({ path: '/campaigns/' + response.data.id })
        }).catch((response) => {
          console.log('badness!', response)
        })
      },
      addEmail (index) {
        console.log('addEmail', index)
        this.emails.splice(index || this.emails.length, 0, EMPTY_EMAIL())
      },
      removeEmail (index) {
        console.log('removeEmail', index)
        this.emails.splice(index, 1)
      },
      updateEmail (text, index) {
        console.log('updateEmail', text, index)
        this.emails[index] = text
      }
    }
  }
</script>

<style lang="scss">
    
</style>
