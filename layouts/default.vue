<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
    >
      <el-menu-item index="1">{{ COMMON.HOMEPAGE }}</el-menu-item>
      <el-submenu index="2">
        <template slot="title">{{ COMMON.CHANNEL_LIST }}</template>
        <el-menu-item
          v-for="(item, index) in channelList"
          :key="index"
          :index="item.id"
        >{{ item.name }}</el-menu-item>
      </el-submenu>
    </el-menu>
    <nuxt class="container" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      activeIndex: '1'
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
      // const routerMap = new Map([
      //   [1, '/']
      // ])
      if (keyPath[0] === '1') {
        this.$router.push({ path: '/' })
      }
      if (keyPath[0] === '2') {
        this.$router.push({ path: `/channels/view/${key}` })
      }
      // this.$router.push({ path: routerMap.get(key) || '/' })
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
</style>
