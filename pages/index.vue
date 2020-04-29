<template>
  <div>

    <div class="row mt-2">
      <el-divider content-position="left">
        <h6 class="d-inline">{{ COMMON.VIP_CHANNEL }}</h6>
        <p class="d-inline">
          <nuxt-link to="/danh-sach-kenh">{{ `(${COMMON.ALL_CHANNEL})` }}</nuxt-link>
        </p>
      </el-divider>
      <div v-for="(channel) in vipChannels" :key="channel.id" class="col-md-3 col-6 my-2 px-2">
        <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
          <el-link
            v-if="channel.logo"
            :underline="false"
            @click="viewChannelDetail(channel)"
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
            @click="viewChannelDetail(channel)"
          >{{ COMMON.SCHEDULE }}</el-button>

        </el-card>
      </div>
    </div>
    <div class="row mt-2">
      <el-divider content-position="left">
        <h6 class="d-inline">{{ COMMON.VIP_TODAY_PROGRAM }}</h6>
        <p class="d-inline">
          <nuxt-link to="/chuong-trinh-hom-nay">{{ `(${COMMON.ALL})` }}</nuxt-link>
        </p>
      </el-divider>
      <div
        v-for="program in todayVipProgramList"
        :key="program.id"
        class="col-md-3 col-6 my-2 px-2"
      >
        <Program :program="program" />
      </div>
    </div>

    <div class="row mt-2">
      <el-divider content-position="left">
        <h6 class="d-inline">{{ COMMON.VIP_INCOMING_PROGRAM }}</h6>
        <p class="d-inline">
          <nuxt-link to="/chuong-trinh-sap-chieu">{{ `(${COMMON.ALL})` }}</nuxt-link>
        </p>
      </el-divider>
      <div
        v-for="program in nextDaysVipProgramList"
        :key="program.id"
        class="col-md-3 col-6 px-2 my-2"
      >
        <Program :program="program" />
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Program from '@/components/programs/Program'
import { sortByRankDesc } from '@/assets/utils/index'

export default {
  components: { Program
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      programList: 'programList',
      todayProgramList: 'todayProgramList',
      nextDaysProgramList: 'nextDaysProgramList'
    }),
    vipChannels() {
      if (this.channelList) {
        return this.channelList.filter(item => item.isVip).slice(0, this.COMMON.VIP_CHANNEL_MAX_NUM)
      } else {
        return null
      }
    },
    todayVipProgramList() {
      if (this.todayProgramList) {
        const clonedList = [...this.todayProgramList]
        return clonedList.sort(sortByRankDesc).slice(0, this.COMMON.TODAY_VIP_PROGRAM_MAX_NUM)
      } else {
        return []
      }
    },
    nextDaysVipProgramList() {
      if (this.nextDaysProgramList) {
        const clonedList = [...this.nextDaysProgramList]
        return clonedList.sort(sortByRankDesc).slice(0, this.COMMON.NEXT_DAYS_VIP_PROGRAM_MAX_NUM)
      } else {
        return []
      }
    }

  },
  watch: {
  },
  mounted() {
    if (!this.todayProgramList) {
      this.fetchTodayProgramList()
    }
    if (!this.nextDaysProgramList) {
      this.fetchNextDaysProgramList()
    }
  },
  methods: {

  }
}
</script>

<style>

.links {
  padding-top: 15px;
}
</style>
