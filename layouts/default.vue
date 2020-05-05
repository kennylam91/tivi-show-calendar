<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" fixed clipped app>
      <v-list>
        <v-list-item v-for="item in items" :key="item.text" link>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.text }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-subheader class="mt-3 grey--text text--darken-1 text-uppercase">
          Subscriptions
        </v-subheader>
        <v-list>
          <v-list-item v-for="item in items2" :key="item.text" link>
            <v-list-item-avatar>
              <img :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`" alt="">
            </v-list-item-avatar>
            <v-list-item-title v-text="item.text" />
          </v-list-item>
        </v-list>
        <v-list-item class="mt-3">
          <v-list-item-action>
            <v-icon color="grey darken-1">
              mdi-plus-circle-outline
            </v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">
            Browse Channels
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon color="grey darken-1">
              mdi-settings
            </v-icon>
          </v-list-item-action>
          <v-list-item-title class="grey--text text--darken-1">
            Manage Subscriptions
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="primary" dense fixed clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-icon class="mx-3">
        mdi-youtube
      </v-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">Youtube</span>
      </v-toolbar-title>
      <v-spacer />
      <v-layout row align-center style="max-width: 650px">
        <v-text-field
          placeholder="Search..."
          single-line
          append-icon="mdi-magnify"
          color="white"
          hide-details
        />
      </v-layout>
    </v-app-bar>
    <v-content>
      <Nuxt />
    </v-content>
  </v-app>
</template>
<script>
import { mapGetters } from 'vuex'
import { COMMON } from '@/assets/utils/constant'
// import SearchResult from '@/components/search/SearchResult'

export default {
  // components: { SearchResult },
  data() {
    return {
      drawer: true,
      items: [
        { icon: 'mdi-home', text: 'Home' },
        { icon: 'mdi-fire', text: 'Trending' },
        { icon: 'mdi-youtube-subscription', text: 'Subscriptions' },
        { icon: 'mdi-folder', text: 'Library' },
        { icon: 'mdi-history', text: 'History' },
        { icon: 'mdi-clock', text: 'Watch Later' },
        { icon: 'mdi-thumb-up', text: 'Liked videos' }
      ],
      items2: [
        { picture: 28, text: 'Joseph' },
        { picture: 38, text: 'Apple' },
        { picture: 48, text: 'Xbox Ahoy' },
        { picture: 58, text: 'Nokia' },
        { picture: 78, text: 'MKBHD' }
      ],
      activeIndex: '1',
      programMenu: [
        { label: COMMON.TODAY, value: '3-1' },
        { label: COMMON.NEXT_DAY, value: '3-2' }
      ],
      pathIndexMatrix: [['/', '1'],
        ['/danh-sach-kenh', '2-1'],
        ['/chuong-trinh-hom-nay', '3-1'],
        ['/chuong-trinh-sap-chieu', '3-2']],
      pathIndexMap: null,
      isActive: false,
      isShowVerticalMenu: false,
      searchText: '',
      visible: false,
      searchAllResults: null
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      todayProgramList: 'todayProgramList',
      nextDaysProgramList: 'nextDaysProgramList',
      fromNowInDayProgramList: 'fromNowInDayProgramList',
      fromNowInDayScheduleList: 'fromNowInDayScheduleList',
      fromTodayProgramList: 'fromTodayProgramList'

    }),
    path() {
      return this.$route.path
    },
    vipChannelList() {
      return this.channelList.filter(channel => channel.isVip === true)
    }
  },
  watch: {
    path: {
      handler() {
        if (this.pathIndexMap) {
          this.activeIndex = this.pathIndexMap.get(this.path)
        }
      }
    }
  },
  created() {

  },
  mounted() {
    for (const channel of this.vipChannelList) {
      const name = channel.name.split(' ').join('-').trim()
      const channelPath = `/lich-chieu/${name}-${channel.id}`
      const index = channel.id
      this.pathIndexMatrix.push([channelPath, index])
    }
    this.pathIndexMap = new Map(this.pathIndexMatrix)
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      if (keyPath[0] === '1') {
        this.$router.push({ path: '/' })
      }
      if (keyPath[0] === '2') {
        if (keyPath[1] === '2-1') {
          this.moveToChannelListView()
        } else {
          const channel = this.channelList.find(item => item.id === key)
          this.viewChannelDetail(channel)
        }
      }
      if (keyPath[0] === '3') {
        if (key === '3-1') {
          this.getTodayProgramView()
        }
        if (key === '3-2') {
          this.getNextDayProgramView()
        }
      }
    },
    select() {
      this.isActive = !this.isActive
      this.isShowVerticalMenu = !this.isShowVerticalMenu
    },
    handleVerticalSelect(key, keyPath) {
      this.select()
      this.handleSelect(key, keyPath)
    },
    handlSearchAll() {
      console.log('handlSearchAll')

      const lowerCaseSearchText = this.searchText.trim().toLowerCase()
      if (lowerCaseSearchText.length < 2) {
        this.$message({
          message: this.COMMON.TYPE_2_CHAR_AT_LEAST,
          type: 'error',
          showClose: true,
          offset: 100
        })
      } else {
        this.searchAllResults = []
        const channelSearchResult = this.channelList.filter(channel => {
          return channel.name.toLowerCase().includes(lowerCaseSearchText)
        })

        this.searchAllResults = this.searchAllResults.concat(channelSearchResult)

        const allProgramList = this.concatTwoProgramList(this.todayProgramList, this.nextDaysProgramList)
        const programSearchResult = allProgramList.filter(program => {
          return program.name.toLowerCase().includes(lowerCaseSearchText) ||
          program.description.toLowerCase().includes(lowerCaseSearchText)
        })
        this.searchAllResults = this.searchAllResults.concat(programSearchResult)

        this.visible = true
      }
    }
  }

}
</script>
<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
  min-width: 140px;
}
.popover-class{
  background-color: #545c64 !important;
}
#searchInput .el-input__inner:focus{
  border-color: purple;
}

</style>
