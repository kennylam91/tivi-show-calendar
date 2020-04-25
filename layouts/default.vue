<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      menu-trigger="hover"
      @select="handleSelect"
    >
      <el-menu-item index="1">
        <i class="el-icon-s-home" />
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">{{ COMMON.SCHEDULE }}</template>
        <el-menu-item
          v-for="(item, index) in channelList"
          :key="index"
          :index="item.id"
        >{{ item.name }}</el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">{{ COMMON.PROGRAM }}</template>
        <el-menu-item
          v-for="(item) in programMenu"
          :key="item.label"
          :index="item.label"
        >{{ item.label }}</el-menu-item>
      </el-submenu>
    </el-menu>
    <nuxt class="container" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { COMMON } from '@/assets/utils/constant'

export default {
  data() {
    return {
      activeIndex: '1',
      programMenu: [
        { label: COMMON.TODAY, value: '3-1' },
        { label: COMMON.NEXT_DAY, value: '3-2' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList'
    })
  },
  created() {
    this.$store.dispatch('app/fetchChannelList')
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      if (keyPath[0] === '1') {
        this.$router.push({ path: '/' })
      }
      if (keyPath[0] === '2') {
        const channel = this.channelList.find(item => item.id === key)
        this.viewChannelDetail(channel)
      }
      if (keyPath[0] === '3') {
        if (key === this.programMenu[0].label) {
          this.getTodayProgramView()
        }
        if (key === this.programMenu[1].label) {
          this.getNextDayProgramView()
        }
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

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.el-menu--collapse .el-menu .el-submenu, .el-menu--popup{
  min-width: 140px;
}

</style>
