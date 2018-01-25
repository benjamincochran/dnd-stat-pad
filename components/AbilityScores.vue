<template>
  <ul class="stats">
    <li class="stat" v-for="(stat, index) in stats">
      <img class="stat--icon" :src="statIcons[index].icon" :title="statIcons[index].text"/>
      <template v-if="stat">
        <span class="stat--text">{{ stat }}</span> 
        <slot name="after" :value="stat" :index="index"/>
      </template>
      <slot v-else name="empty" :value="stat" :index="index"/>
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['stats'],
    data () {
      return {
        statIcons: [
          {text: 'Strength', icon: '/svg/strong.svg'},
          {text: 'Dexterity', icon: '/svg/tightrope.svg'},
          {text: 'Constitution', icon: '/svg/heart-drop.svg'},
          {text: 'Intelligence', icon: '/svg/brain.svg'},
          {text: 'Wisdom', icon: '/svg/eye-of-horus.svg'},
          {text: 'Charisma', icon: '/svg/charm.svg'}
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stat {
    margin: 15px 0px;
    height: 2.5rem;
    line-height: 2.5rem;
    position: relative;
    list-style-type: none;

    & > * {
      display: inline-block;
      vertical-align: middle;
      & + * {
        margin-left: 1rem;
      }
    }

    .stat--icon {
      display: inline-block;
      height: 2.5rem;
      width: 2.5rem;
    }

    .stat--text {
      line-height: 2rem;
      font-size: 2rem;
      text-align: right;
      width: 2.25rem;
    }

  }
</style>
