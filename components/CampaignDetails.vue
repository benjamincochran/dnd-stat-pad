<template>
  <aside class="box content">
    <h3>Settings</h3> 
    <dl>
      <dt>Dice</dt><dd>{{ diceCount }}d6</dd>
      <dt>Fixed Order</dt><dd>{{ fixedOrder }}</dd>
    </dl>
    <h3>Time Remaining</h3>
    <dl>
      <dt>Created</dt><dd>{{ created }}</dd>
      <dt>Expires</dt><dd>{{ expires }}</dd>
    </dl>
  </aside>
</template>

<script>
  import moment from 'moment'

  const DATE_FORMAT = 'M/D/YY h:mm A'

  export default {
    props: ['campaign'],
    data () {
      var createdDate = moment(this.campaign.created)
      this.campaign.created = createdDate.format(DATE_FORMAT)
      this.campaign.expires = createdDate.add(14, 'days').format(DATE_FORMAT)
      return this.campaign
    }
  }
</script>

<style lang="scss" scoped>
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
</style>
