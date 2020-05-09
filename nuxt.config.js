
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Truyền hình 24h',
    htmlAttrs: {
      lang: 'vi'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description',
        content: 'Truyền hình 24h - Cập nhật lịch phát sóng các kênh truyền hình hay nhất hàng ngày (HBO, Cinemax, AXN, Fox Movies, Red By HBO, Discovery, ...)' }
    ],
    link: [
    ],
    script: [
      { src: 'https://apis.google.com/js/api.js' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/element-variables.scss',
    '@/assets/css/index.scss',
    '@/assets/css/navbar.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/element-ui', ssr: true },
    '@/plugins/filters',
    '@/plugins/mixins',
    { src: '@/plugins/gg-calendar', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    'bootstrap-vue/nuxt'
  ],
  /*
  ** Build configuon
  */
  build: {

    transpile: [/^element-ui/],
    /*
    ** You can extend webpack confi here
    */
    extend(config, ctx) {
    }
  },
  render: {
    ssr: true
  }
}
