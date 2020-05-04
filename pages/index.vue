<template>
  <div>
    <div class="row mt-2">
      <el-divider content-position="left">
        <h6 class="d-inline">{{ COMMON.ON_BROADCASTING_PROGRAMS }}</h6>
      </el-divider>
      <div
        v-for="program in broadCastingPrograms"
        :key="program.id"
        class="col-md-3 col-6 my-2 px-1"
      >
        <Program v-if="program" :live="true" :program="program" />
      </div>
    </div>
    <div class="row mt-2">
      <el-divider content-position="left">
        <h6 class="d-inline">{{ COMMON.VIP_INCOMING_PROGRAM }}</h6>
        <p class="d-inline">
          <nuxt-link to="/chuong-trinh-hom-nay">{{ `(${COMMON.ALL})` }}</nuxt-link>
        </p>
      </el-divider>
      <div
        v-for="program in onGoingTodayProgramList"
        :key="program.id"
        class="col-md-3 col-6 my-2 px-1"
      >
        <Program v-if="program" :program="program" />
      </div>
    </div>

    <div class="row mt-2">
      <el-divider content-position="left">
        <h6 class="d-inline">{{ COMMON.VIP_TOMORROW_PROGRAM }}</h6>
        <p class="d-inline">
          <nuxt-link to="/chuong-trinh-sap-chieu">{{ `(${COMMON.ALL})` }}</nuxt-link>
        </p>
      </el-divider>
      <div
        v-for="program in nextDaysVipProgramList"
        :key="program.id"
        class="col-md-3 col-6 px-1 my-2"
      >
        <Program :program="program" />
      </div>
    </div>
    <div class="row mt-2">
      <el-divider content-position="left">
        <h6 class="d-inline">{{ COMMON.VIP_CHANNEL }}</h6>
        <p class="d-inline">
          <nuxt-link to="/danh-sach-kenh">{{ `(${COMMON.ALL_CHANNEL})` }}</nuxt-link>
        </p>
      </el-divider>
      <div v-for="(channel) in vipChannels" :key="channel.id" class="col-md-3 col-6 my-2 px-1">
        <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
          <el-link
            v-if="channel.logo"
            :underline="false"
            @click="viewChannelDetail(channel)"
          >
            <img
              class="img-fluid"
              :src="channel.logo"
              :alt="channel.name"
            >
          </el-link>
          <el-button
            class="my-2 w-100 py-2 px-1"
            type="primary"
            size="small"
            @click="viewChannelDetail(channel)"
          >{{ COMMON.SCHEDULE }} {{ channel.name }}</el-button>

        </el-card>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Program from '@/components/programs/Program'
import { sortByRankDesc } from '@/assets/utils/index'

export default {
  components: { Program },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      todayProgramList: 'todayProgramList',
      channelList: 'channelList',
      nextDaysProgramList: 'nextDaysProgramList',
      fromTodayProgramList: 'fromTodayProgramList',
      fromNowInDayProgramList: 'fromNowInDayProgramList',
      fromNowInDayScheduleList: 'fromNowInDayScheduleList'
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
        return clonedList.sort(sortByRankDesc).slice(0, this.COMMON.NEXT_DAY_VIP_PROGRAM_MAX_NUM)
      } else {
        return []
      }
    },
    fromNowInDayVipProgramList() {
      if (this.fromNowInDayProgramList) {
        const clonedList = [...this.fromNowInDayProgramList]
        return clonedList.sort(sortByRankDesc).slice(0, this.COMMON.TODAY_VIP_PROGRAM_MAX_NUM)
      } else {
        return []
      }
    },
    broadCastingPrograms() {
      const liveSchedules = this.fromNowInDayScheduleList.filter(this.liveProgramFilter)
      const livePrograms = []
      liveSchedules.forEach(schedule => {
        const program = this.fromTodayProgramList.find(item => item.id === schedule.programId)
        livePrograms.push({ ...program, schedule: schedule })
      })
      return livePrograms.sort(sortByRankDesc).slice(0, 4)
    },
    onGoingTodayProgramList() {
      const list = []
      for (const program of this.fromNowInDayProgramList) {
        if (!this.broadCastingPrograms.some(item => item.id === program.id)) {
          list.push({ ...program })
        }
      }
      return list.sort(sortByRankDesc).slice(0, this.COMMON.TODAY_VIP_PROGRAM_MAX_NUM)
    }

  },
  watch: {
  },
  mounted() {

  },
  methods: {
    liveProgramFilter(schedule) {
      return schedule.startTime.seconds * 1000 < Date.parse(new Date()) + 30 * 60 * 1000
    }

  }
}
</script>

<style>

.links {
  padding-top: 15px;
}
</style>
