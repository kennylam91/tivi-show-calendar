<template>
  <div>
    <div class="justify-between-align-center">
      <div class="p-4">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path: '/dashboard'}">
            <span>{{ COMMON.DASHBOARD }}</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span>{{ COMMON.CHANNEL_LIST }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-button type="text" @click="handleLogout">Log out</el-button>
    </div>

    <el-card
      shadow="never"
      class="my-2"
      :body-style="{ padding: '16px' }"
    >
      <div slot="header" class="justify-between-align-center">
        <h4 class="bold">{{ COMMON.CHANNEL_LIST }}</h4>
        <el-button type="danger" size="small" @click="clearScheduleCache">Clear Schedule Cache</el-button>
        <el-button
          type="success"
          size="small"
          @click="$router.push({ path: '/channels/create' })"
        >{{ COMMON.CREATE_CHANNEL }}</el-button>
      </div>
      <ChannelTable v-if="channelList" :channel-list="channelList" :is-admin="true" />

    </el-card>
  </div>
</template>
<script>
import ChannelTable from '@/components/channels/ChannelTable'

export default {
  components: { ChannelTable },
  middleware: 'auth',
  data() {
    return {
    }
  },
  computed: {
    // cannot use mapGetters bz we need to change the value of object  => error cannot mutate vuex
    channelList() {
      const list = this.$store.state.app.channelList
      const result = []
      if (list) {
        list.forEach(item => {
          result.push({ ...item })
        })
        return result
      } else {
        return null
      }
    }
  },
  watch: {
    channelList: {
      immediate: true,
      handler() {
        if (!this.channelList) {
          this.$store.dispatch('app/fetchChannelList')
        }
      }
    }
  },
  created() {

  },
  methods: {
    clearScheduleCache() {
      this.$store.dispatch('app/clearScheduleCache').then(res => {
        this.$notify({
          title: 'Clear cache successfully',
          type: 'success',
          duration: '4500',
          position: 'bottom-right'
        })
      })
    }

  }
}
</script>
