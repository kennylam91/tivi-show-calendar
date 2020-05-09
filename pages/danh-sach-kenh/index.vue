<template>
  <div>
    <div>
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

    <section>
      <el-card shadow="never" class="my-2" :body-style="{ padding: '16px' }">
        <div slot="header">
          <h4>{{ COMMON.CHANNEL_LIST }}</h4>
        </div>
        <ChannelTable v-if="channelList" :channel-list="channelList" :is-admin="false" />
      </el-card>
      <el-card shadow="never" :body-style="{ padding: '5px' }">
        <span>Tags: </span>
        <el-tag
          v-for="(item) in tags"
          :key="item"
          style="margin: 2px;"
          size="mini"
          type="info"
          effect="plain"
        >{{ item }}</el-tag>

      </el-card>
    </section>

  </div>
</template>
<script>
import ChannelTable from '@/components/channels/ChannelTable'
import { mapGetters } from 'vuex'
import { COMMON } from '@/assets/utils/constant'

export default {
  components: { ChannelTable },
  data() {
    return {
      tags: [COMMON.SCHEDULE, COMMON.SCHEDULE + ' HBO', COMMON.SCHEDULE + ' FOX MOVIES',
        COMMON.SCHEDULE + ' CINEMAX', COMMON.SCHEDULE + ' AXN', COMMON.SCHEDULE + ' DISCOVERY',
        COMMON.SCHEDULE + ' RED BY HBO', COMMON.TODAY_SCHEDULE, COMMON.TODAY_SCHEDULE_2, COMMON.GOOD_MOVIE]
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
