<template>
  <div>

    <div class="row mt-2">
      <el-divider content-position="left">
        <h4>{{ COMMON.VIP_CHANNEL }}</h4>
      </el-divider>
      <div v-for="(channel) in vipChannels" :key="channel.id" class="col-md-6 col-xs-12 col-lg-3 my-2">
        <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
          <el-link
            v-if="channel.logo"
            :underline="false"
            @click="handleViewChannelDetail(channel)"
          >
            <el-image
              style="width: 100%;"
              :src="channel.logo"
              :alt="channel.name"
              fit="fill"
            />
          </el-link>
          <div v-else>{{ channel.name }}</div>
          <el-button class="my-2" plain type="text" @click="handleViewChannelDetail(channel)">{{ COMMON.SCHEDULE }}</el-button>
        </el-card>
      </div>
    </div>
    <div class="row mt-2">
      <el-divider content-position="left">
        <h4>{{ COMMON.VIP_TODAY_PROGRAM }}</h4>
      </el-divider>
      <!-- <div v-for="(channel) in vipChannels" :key="channel.id" class="col-md-6 col-xs-12 col-lg-3 my-2">
          <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
            <el-link
              v-if="channel.logo"
              :underline="false"
              @click="handleViewChannelDetail(channel)"
            >
              <el-image
                style="width: 100%;"
                :src="channel.logo"
                :alt="channel.name"
                fit="fill"
              />
            </el-link>
            <div v-else>{{ channel.name }}</div>
            <el-button class="my-2" plain type="text" @click="handleViewChannelDetail(channel)">{{ COMMON.SCHEDULE }}</el-button>

          </el-card>
        </div> -->
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
    handleViewChannelDetail(channel) {
      this.viewChannelDetail(channel.id)
    }
  }
}
</script>

<style>

.links {
  padding-top: 15px;
}
</style>
