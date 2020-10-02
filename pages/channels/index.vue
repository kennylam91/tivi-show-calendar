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
        <span class="bold">{{ COMMON.CHANNEL_LIST }}</span>
        <el-button
          type="primary"
          size="small"
          plain
          @click="handleCreateChannelClick"
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
      channelList: []
    }
  },
  computed: {

  },
  watch: {
  },
  created() {
    this.$store.dispatch('app/fetchChannelList', { page: 1, limit: 20 }).then(data => {
      this.channelList = data.content
    })
  },
  methods: {
    handleCreateChannelClick() {
      this.$router.push({ path: '/channels/create' })
    }
  }
}
</script>
