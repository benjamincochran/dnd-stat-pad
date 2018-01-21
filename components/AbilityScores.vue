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
        margin-left: 0.5rem;
      }
    }

    .stat--icon {
      display: inline-block;
      height: 100%;
      width: auto;
    }

    .stat--text {
      line-height: 2rem;
      font-size: 2rem;
    }

  }
</style>

<script>
  export default {
    props: ['stats'],
    data () {
      return {
        statIcons: [
          {text: 'Strength', icon: 'http://game-icons.net/icons/lorc/originals/svg/strong.svg'},
          {text: 'Dexterity', icon: 'http://game-icons.net/icons/delapouite/originals/svg/tightrope.svg'},
          {text: 'Constitution', icon: 'http://game-icons.net/icons/lorc/originals/svg/heart-drop.svg'},
          {text: 'Intelligence', icon: 'http://game-icons.net/icons/lorc/originals/svg/brain.svg'},
          {text: 'Wisdom', icon: 'http://game-icons.net/icons/delapouite/originals/svg/eye-of-horus.svg'},
          {text: 'Charisma', icon: 'http://game-icons.net/icons/lorc/originals/svg/charm.svg'}
        ]
      }
    }
  }
</script>
