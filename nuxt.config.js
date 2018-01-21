module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'dnd-stat-pad',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Stat Pad' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    { src: '~/assets/css/main.scss', lang: 'scss'},
    { src: '~/assets/css/buefy-overrides.scss', lang: 'sass' }
  ],
  plugins: ['~plugins/buefy'],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios'],
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    },
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
