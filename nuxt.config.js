
export default {
  mode: 'universal',
  server: {
    // port: 4000, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
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
        content: 'Trang web tổng hợp các chương trình, phim truyện hay nhất trên các kênh truyền hình nổi tiếng( HBO, Cinemax, AXN, Fox Movies, Red By HBO, Discovery, VTV, THVL, TodayTV, ...)' }
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap'
      }
    ],
    script: [
      { src: 'https://apis.google.com/js/api.js' }
      // { src: '<script data-ad-client="ca-pub-5015264560254635" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>' }
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
    { src: '@/plugins/vue-lazyload', mode: 'client' },
    { src: '@/plugins/read-more', mode: 'client' },
    { src: '@/plugins/gg-calendar', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/dotenv'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
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
