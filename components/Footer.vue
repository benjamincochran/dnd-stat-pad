<template>
  <footer class="footer content is-small">
      D&amp;D Stat Pad is &copy; Ben Cochran {{ year }}, but open-sourced under the MIT License.  You can contribute at <a target="_blank" href="https://github.com/benjamincochran/dnd-stat-pad">https://github.com/benjamincochran/dnd-stat-pad</a>
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
  }
</style>