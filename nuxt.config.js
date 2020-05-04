
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
      { hid: 'description', name: 'description', content: 'Truyền hình 24h cung cấp các thông tin đầy đủ, chính xác lịch chiếu và thông tin các chương trình trên các kênh truyền hình hiện nay.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
    '@/plugins/mixins'
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
