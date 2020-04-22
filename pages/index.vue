<template>
  <div>

    <div class="row mt-2">
      <el-divider content-position="left">
        <h4>{{ COMMON.VIP_CHANNEL }}</h4>
      </el-divider>
      <div v-for="(channel) in vipChannels" :key="channel.id" class="col-md-6 col-xs-12 col-lg-3 my-2">
        <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
          <el-image
            v-if="channel.logo"
            style="width: 100%;"
            :src="channel.logo"
            fit="fill"
            @click="handleViewSchedule(channel)"
          />
          <el-button class="my-2" plain type="text" @click="handleViewSchedule(channel)">{{ COMMON.SCHEDULE }}</el-button>

        </el-card>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList'
    }),
    vipChannels() {
      return this.channelList.filter(item => item.isVip)
    }
  },
  methods: {
    handleViewSchedule(channel) {
      console.log('handleViewSchedule')
      this.$router.push({ path: `/channels/view/${channel.id}` })
    }
  }
}
</script>

<style>

.links {
  padding-top: 15px;
}
</style>
