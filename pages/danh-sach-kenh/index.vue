<template>
  <div>
    <div>
      <div class="p-4">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{path: '/'}">
            <span v-text="COMMON.HOMEPAGE" />
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <span v-text="COMMON.CHANNEL_LIST" />
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <section>
      <el-card shadow="never" class="my-2" :body-style="{ padding: '16px' }">
        <div slot="header">
          <h4 v-text="COMMON.CHANNEL_LIST" />
        </div>
        <ChannelTable
          v-if="channelList"
          :channel-list="vipChannelList"
          :is-admin="false"
        />
      </el-card>
    </section>

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
    }),
    vipChannelList() {
      return this.channelList.filter(item => item.vip)
    }
  },
  watch: {
  },
  methods: {
    handleCreateChannelClick() {
      this.$router.push({ path: '/channels/create' })
    }
  }
}
</script>
