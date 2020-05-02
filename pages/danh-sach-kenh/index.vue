<template>
  <div>
    <div class="justify-between-align-center">
      <div class="p-4">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path: '/'}">
            <span>{{ COMMON.HOMEPAGE }}</span>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span>{{ COMMON.CHANNEL_LIST }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <el-card class="my-2" :body-style="{ padding: '16px' }">
      <div slot="header" class="justify-between-align-center">
        <span class="bold">{{ COMMON.CHANNEL_LIST }}</span>
      </div>
      <ChannelTable v-if="channelList" :channel-list="channelList" :is-admin="false" />

    </el-card>
  </div>
</template>
<script>
import ChannelTable from '@/components/channels/ChannelTable'
import { mapGetters } from 'vuex'

export default {
  components: { ChannelTable },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList'
    })
  },
  watch: {
  },
  methods: {
    handleCreateChannelClick() {
      console.log('handleCreateChannelClick')
      this.$router.push({ path: '/channels/create' })
    }
  }
}
</script>
