<template>
  <footer class="footer content is-small">
      D&amp;D Stat Pad is &copy; Ben Cochran {{ year }}, but open-sourced under the MIT License.  You can contribute at <a href="https://github.com/benjamincochran/dnd-stat-pad" target="_blank">github.com/benjamincochran/dnd-stat-pad</a><br/>
      "Tightrope" and "Eye of Horus" icons &copy; <a href="http://delapouite.com/" target="_blank">Delapouite</a>; "Strong", "Heart Drop", "Brain", and "Charm" icons &copy; <a href="http://lorcblog.blogspot.com/" target="_blank">Lorc</a> under the <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank">CC BY 3.0 license</a>.  Find more at <a href="http://game-icons.net/" target="_blank">game-icons.net</a>
  </footer>
</template>

<script>
  export default {
    data () {
      return {
        year: (new Date()).getFullYear()
      }
    }
  }
</script>

<style lang="scss">
  footer.footer {
    padding: 20px;
    text-align: center;
    border-top: 1px solid #ddd;

    a {
      text-decoration: underline;
    }
  }
</style>