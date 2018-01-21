<template>
  <div class="layout layout-default">
    <site-header/>
    <nuxt class="section"/>
    <site-footer/>
  </div>
</template>

<script>
import SiteHeader from '~/components/Header.vue'
import SiteFooter from '~/components/Footer.vue'

export default {
  components: {
    SiteHeader,
    SiteFooter
  }
}
</script>

<style lang="scss">
  @import "~bulma/sass/utilities/_all";
  $primary: #ffae42;
  $primary-invert: findColorInvert($primary);
  $colors: ("primary": ($primary, $primary-invert));
  @import "~bulma";
  @import "~buefy/src/scss/buefy";

  .layout-default {
    display: flex;
    min-height: 100vh;
    flex-direction: column;

    .section {
      flex: 1;
      position: relative;
      
      &:before {
        display: block;
        content: ' ';
        background-image: url('/sheet_dice.jpg');
        background-size: cover;
        opacity: 0.4;
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        z-index: 0;
      }

      .box {
        background-color: rgba(255, 255, 255, 0.85);
      }
    }
  }
</style>
