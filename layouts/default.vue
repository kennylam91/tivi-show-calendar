<template>
  <div>
    <header>
      <nav id="defaultLayout">
        <div class="navWrapper">
          <div id="menu" :class="{active: isActive}">
            <el-menu
              ref="mainMenu"
              :default-active="activeIndex"
              mode="horizontal"
              active-text-color="#003a77"
              menu-trigger="click"
              @select="handleSelect"
            >
              <el-menu-item index="1">
                <span>
                  <i class="el-icon-s-home" /><span v-text="COMMON.HOMEPAGE" />
                </span>
              </el-menu-item>
              <el-submenu index="2">
                <template slot="title">
                  <span v-text="COMMON.SCHEDULE" />
                </template>
                <el-menu-item index="2-1">
                  <span v-text="COMMON.CHANNEL_LIST" />
                </el-menu-item>
                <!-- <el-menu-item
                  v-for="(item, index) in vipChannelList"
                  :key="index"
                  :index="item.name"
                >
                  <span v-text="item.name " />
                </el-menu-item> -->
                <span :key="navbarKey">
                  <el-submenu v-for="(value, name) in networkObj" :key="name" :index="value">
                    <template slot="title">{{ name }}</template>
                    <el-menu-item
                      v-for="channel in value"
                      :key="channel.id"
                      :index="channel.id"
                    >{{ channel.name }}</el-menu-item>
                  </el-submenu>
                </span>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <span v-text="COMMON.PROGRAM" />
                </template>
                <el-menu-item
                  v-for="(item) in programMenu"
                  :key="item.value"
                  :index="item.value"
                >
                  <span v-text="item.label" />
                </el-menu-item>
              </el-submenu>
              <div id="searchInput">
                <el-popover
                  v-model="visible"
                  placement="bottom-start"
                  trigger="manual"
                  popper-class="popover-class"
                >
                  <div
                    v-for="(result, index) in searchAllResults"
                    :key="index"
                    class="my-1 w-100 "
                  >
                    <SearchResult :result="result" :width="60" />
                  </div>

                  <el-input
                    slot="reference"
                    v-model="searchText"
                    :placeholder="COMMON.SEARCH_CHANNEL_PROGRAM"
                    prefix-icon="el-icon-search"
                    clearable
                    style=""
                    @keydown.enter.native="handlSearchAll"
                    @blur="visible = false"
                  />
                </el-popover>

              </div>
            </el-menu>
          </div>
          <div id="toggle" @click="select">
            <div id="top" class="span" :class="{ active: isActive }" />
            <div id="middle" class="span" :class="{ active: isActive }" />
            <div id="bottom" class="span" :class="{ active: isActive }" />
          </div>

        </div>
      </nav>

      <!-- mobile navbar -->

      <nav>
        <el-menu
          v-if="isShowVerticalMenu"
          id="verticalMenu"
          ref="mainMenu"
          style="position:fixed; top: 65px; z-index: 99999; width: 100%;"
          active-text-color="#003a77"
          :default-active="activeIndex"
          mode="vertical"
          menu-trigger="click"
          @select="handleVerticalSelect"
        >
          <el-menu-item index="1">
            <i class="el-icon-s-home" />{{ COMMON.HOMEPAGE }}
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title">{{ COMMON.SCHEDULE }}</template>
            <el-menu-item index="2-1">
              {{ COMMON.CHANNEL_LIST }}
            </el-menu-item>
            <el-menu-item
              v-for="(item, index) in vipChannelList"
              :key="index"
              :index="item.name"
            >{{ item.name }}</el-menu-item>

          </el-submenu>

          <el-submenu index="3">
            <template slot="title">{{ COMMON.PROGRAM }}</template>
            <el-menu-item
              v-for="(item) in programMenu"
              :key="item.value"
              :index="item.value"
            >{{ item.label }}</el-menu-item>
          </el-submenu>

        </el-menu>
      </nav>
    </header>
    <main class="container" style="margin-top: 60px;">
      <nuxt />
    </main>
    <el-divider class="m-2" />
    <footer class="py-4 px-2">
      <div class="container">
        <div class="justify-between-align-center">
          <div>
            <div class="mb-2">
              <nuxt-link class="color-dark-blue bold" to="/"><i class="el-icon-s-home" /> {{ COMMON.HOMEPAGE }}</nuxt-link>
            </div>
            <div>
              <nuxt-link
                class="color-dark-blue bold block"
                to="/danh-sach-kenh"
              ><i class="el-icon-date" /> {{ COMMON.SCHEDULE }}</nuxt-link>
            </div>
          </div>
          <div>
            <div class="mb-2">
              <nuxt-link
                class="color-dark-blue bold block"
                to="/chuong-trinh-hom-nay"
              ><i class="el-icon-video-play" /> {{ COMMON.TODAY_PROGRAM }}</nuxt-link>
            </div>
            <div>
              <nuxt-link
                class="color-dark-blue bold block"
                to="/chuong-trinh-sap-chieu"
              ><i class="el-icon-time" /> {{ COMMON.NEXT_DAY_PROGRAM }}</nuxt-link>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <p><i class="el-icon-message" /> {{ COMMON.CONTACT_US }} : truyenhinh24h.live@gmail.com</p>
        </div>
      </div>

    </footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { COMMON } from '@/assets/utils/constant'
import SearchResult from '@/components/search/SearchResult'
// import Tags from '@/components/tags/Tags'

export default {
  components: { SearchResult },
  data() {
    return {
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
      searchAllResults: null,
      networkObj: {},
      navbarKey: 0

    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      todayProgramList: 'todayProgramList',
      nextDaysProgramList: 'nextDaysProgramList',
      fromNowInDayProgramList: 'fromNowInDayProgramList',
      fromNowInDayScheduleList: 'fromNowInDayScheduleList',
      fromTodayProgramList: 'fromTodayProgramList',
      loading: 'loading',
      vipChannelList: 'vipChannelList'
    }),
    path() {
      return this.$route.path
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
    for (const channel of this.channelList) {
      const name = channel.name.split(' ').join('-').trim()
      const channelPath = `/lich-chieu/${name}-${channel.id}`
      const index = channel.id
      this.pathIndexMatrix.push([channelPath, index])
      if (channel.networkName) {
        if (this.networkObj[channel.networkName] === undefined) {
          this.networkObj[channel.networkName] = [channel]
        } else {
          this.networkObj[channel.networkName].push(channel)
        }
      }
    }
    this.navbarKey++
    this.pathIndexMap = new Map(this.pathIndexMatrix)
  },
  methods: {
    handleSelect(key, keyPath) {
      if (keyPath[0] === '1') {
        this.$router.push({ path: '/' })
      }
      if (keyPath[0] === '2') {
        if (keyPath[1] === '2-1') {
          this.moveToChannelListView()
        } else {
          const channel = this.channelList.find(item => item.name === key)
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
        this.$store.dispatch('app/searchProgram', { searchName: this.searchText, page: 1, limit: 8 }).then(res => {
          this.searchAllResults = this.searchAllResults.concat(res.content)
        })
        this.visible = true
      }
    }

  }

}
</script>
<style>
html {
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
  background-color: #212529 !important;
  width: 90%;
  max-width: 500px;
}

</style>
