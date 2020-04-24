<template>
  <div>

    <div class="row mt-2">
      <el-divider content-position="left">
        <h5>{{ COMMON.VIP_CHANNEL }}</h5>
      </el-divider>
      <div v-for="(channel) in vipChannels" :key="channel.id" class="col-md-3 col-xs-6 my-2 px-2">
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
          <el-button
            class="my-2 w-100"
            type="primary"
            size="small"
            @click="handleViewChannelDetail(channel)"
          >{{ COMMON.SCHEDULE }}</el-button>

        </el-card>
      </div>
    </div>
    <div class="row mt-2">
      <el-divider content-position="left">
        <h5>{{ COMMON.VIP_TODAY_PROGRAM }}</h5>
      </el-divider>
      <div
        v-for="program in todayVipPrograms"
        :key="program.id"
        class="col-md-3 col-xs-6 my-2 px-2"
      >
        <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
          <el-link
            v-if="program.logo"
            :underline="false"
            @click="handleViewProgramDetail(program)"
          >
            <el-image
              style="width: 100%;"
              :src="program.logo"
              :alt="program.name"
              fit="fill"
            />
          </el-link>
          <div v-else>{{ program.name }}</div>
          <el-link
            id="programName"
            class="my-2 w-100"
            type="success"
            @click="handleViewProgramDetail(program)"
          >
            <el-tooltip
              :content="program.name | getVNTranslateName"
              placement="bottom"
              effect="dark"
            >
              <div class="shorten-text color-primary bold">
                {{ program.name | shortenName }}
              </div>
            </el-tooltip>
          </el-link>
          <el-tag
            v-for="(item, index) in program.categories"
            :key="index"
            size="small"
            effect="dark"
            type="info"
            style="margin: 2px;"
          >
            {{ item | getCategory }}
          </el-tag>
        </el-card>
      </div>
    </div>

    <div class="row mt-2">
      <el-divider content-position="left">
        <h5>{{ COMMON.VIP_INCOMING_PROGRAM }}</h5>
      </el-divider>
      <div
        v-for="program in nextDaysVipPrograms"
        :key="program.id"
        class="col-md-3 col-xs-6 px-2 my-2"
      >
        <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
          <el-link
            v-if="program.logo"
            :underline="false"
            @click="handleViewProgramDetail(program)"
          >
            <el-image
              style="width: 100%;"
              :src="program.logo"
              :alt="program.name"
              fit="fill"
            />
          </el-link>
          <div v-else>{{ program.name }}</div>
          <el-link
            id="programName"
            class="my-2 w-100"
            type="success"
            @click="handleViewProgramDetail(program)"
          >
            <el-tooltip :content="program.name | getVNTranslateName" placement="bottom" effect="dark">
              <div class="shorten-text color-primary bold">
                {{ program.name | shortenName }}
              </div>
            </el-tooltip>
          </el-link>
          <el-tag
            v-for="(item, index) in program.categories"
            :key="index"
            size="small"
            effect="dark"
            type="info"
            style="margin: 2px;"
          >
            {{ item | getCategory }}
          </el-tag>
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
  data() {
    return {
      todayVipPrograms: null,
      nextDaysVipPrograms: null
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList'
    }),
    vipChannels() {
      if (this.channelList) {
        return this.channelList.filter(item => item.isVip).slice(0, this.COMMON.VIP_CHANNEL_MAX_NUM)
      } else {
        return null
      }
    }
  },
  created() {
    this.$store.dispatch('app/fetchProgramList', { isTodayShow: true }).then(list => {
      this.todayVipPrograms = list.slice(0, this.COMMON.TODAY_VIP_PROGRAM_MAX_NUM)
    })
    this.$store.dispatch('app/fetchProgramList', { isNextDaysShow: true }).then(list => {
      this.nextDaysVipPrograms = list.slice(0, this.COMMON.NEXT_DAY_VIP_PROGRAM_MAX_NUM)
    })
  },
  methods: {
    handleViewChannelDetail(channel) {
      this.viewChannelDetail(channel)
    },
    handleViewProgramDetail(program) {
      this.viewProgramDetail(program)
    }
  }
}
</script>

<style>

.links {
  padding-top: 15px;
}
#programName .el-link--inner {
  width: 100%;
}
</style>
