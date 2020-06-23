<template>
  <div>
    <article class="pb-2 pt-4">
      <h4 class="color-dark-blue">
        {{ COMMON.ON_BROADCASTING_PROGRAMS | uppercaseFirst }}
      </h4>
      <el-divider class="mt-4 mb-2" />
      <div class="row">
        <div
          v-for="program in broadCastingPrograms"
          :key="program.id"
          class="col-md-3 col-6 my-2 px-1"
        >
          <Program v-if="program" :live="true" :program="program" />
        </div>
      </div>
    </article>

    <article v-if="noonProgramList" class="py-2">
      <h4 class="color-dark-blue">{{ COMMON.WHAT_SEE_THIS_NOON }}      </h4>
      <el-divider class="mt-4 mb-2" />
      <div class="row mt-2">
        <div
          v-for="program in noonProgramList"
          :key="program.id"
          class="col-md-3 col-6 px-1 my-2"
        >
          <Program :live="true" :program="program" />
        </div>
      </div>
    </article>

    <article v-if="eveningProgramList" class="py-2">
      <h4 class="color-dark-blue">{{ COMMON.WHAT_SEE_THIS_EVENING }}      </h4>
      <el-divider class="mt-4 mb-2" />
      <div class="row mt-2">
        <div
          v-for="program in eveningProgramList"
          :key="program.id"
          class="col-md-3 col-6 px-1 my-2"
        >
          <Program :live="true" :program="program" />
        </div>
      </div>
    </article>

    <article class="py-2">
      <h4>
        <nuxt-link to="/chuong-trinh-hom-nay" class="color-dark-blue">
          {{ COMMON.VIP_INCOMING_PROGRAM | uppercaseFirst }}
          <el-divider class="mt-4 mb-2" />
        </nuxt-link>
      </h4>
      <div class="row mt-2">
        <div
          v-for="program in onGoingTodayProgramList"
          :key="program.id"
          class="col-md-3 col-6 my-2 px-1"
        >
          <Program :program="program" />
        </div>
      </div>
    </article>

    <article class="py-2">
      <h4>
        <nuxt-link to="/chuong-trinh-sap-chieu" class="color-dark-blue">
          {{ COMMON.VIP_TOMORROW_PROGRAM | uppercaseFirst }}
        </nuxt-link>
      </h4>
      <el-divider class="mt-4 mb-2" />
      <div class="row mt-2">
        <div
          v-for="program in nextDaysVipProgramList"
          :key="program.id"
          class="col-md-3 col-6 px-1 my-2"
        >
          <Program :program="program" />
        </div>
      </div>
    </article>

    <article class="py-2">
      <h4>
        <nuxt-link to="/danh-sach-kenh" class="color-dark-blue">
          {{ COMMON.VIP_CHANNEL | uppercaseFirst }}
        </nuxt-link>
      </h4>
      <el-divider class="mt-4 mb-2" />

      <div class="row mt-2">
        <div v-for="(channel) in vipChannels" :key="channel.id" class="col-md-3 col-6 my-2 px-1">
          <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
            <el-link
              v-if="channel.logo"
              :underline="false"
              @click="viewChannelDetail(channel)"
            >
              <img
                v-lazy="channel.logo"
                class="img-fluid"
                :alt="channel.name"
              >
            </el-link>
            <el-button
              class="my-2 w-100 py-2 px-1"
              size="small"
              type="primary"
              @click="viewChannelDetail(channel)"
            >{{ COMMON.SCHEDULE }} {{ channel.name }}</el-button>
          </el-card>
        </div>
      </div>
    </article>

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
      onGoingTodayProgramList: null,
      nextDaysVipProgramList: null
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
        return clonedList.slice(0, this.COMMON.TODAY_VIP_PROGRAM_MAX_NUM)
      } else {
        return []
      }
    },
    broadCastingPrograms() {
      const liveSchedules = this.fromNowInDayScheduleList.filter(this.liveProgramFilter)
      const livePrograms = []
      liveSchedules.forEach(schedule => {
        const program = this.fromTodayProgramList.find(item => item.id === schedule.programId)
        if (program && !livePrograms.some(pro => pro.id === program.id)) {
          livePrograms.push({ ...program, schedule: schedule })
        }
      })
      return this.getFourOrEightPrograms(livePrograms)
    },
    noonProgramList() {
      const now = new Date()
      if (now.getHours() > 12) {
        return null
      }
      return this.getFourOrEightPrograms(this.getProgramListBetweenHours(11, 0, 13, 0))
    },
    eveningProgramList() {
      const now = new Date()
      if (now.getHours() > 22) {
        return null
      }
      return this.getFourOrEightPrograms(this.getProgramListBetweenHours(20, 0, 23, 0))
    }

  },
  watch: {
  },
  mounted() {
    const list = []
    for (const program of this.fromNowInDayProgramList) {
      if (program) {
        if (!this.broadCastingPrograms.some(item => item.id === program.id)) {
          list.push({ ...program })
        }
      }
    }
    this.onGoingTodayProgramList = list
      .slice(0, this.COMMON.TODAY_VIP_PROGRAM_MAX_NUM)

    if (this.nextDaysProgramList) {
      const clonedList = [...this.nextDaysProgramList]
      this.nextDaysVipProgramList = clonedList
        .slice(0, this.COMMON.NEXT_DAY_VIP_PROGRAM_MAX_NUM)
    } else {
      this.nextDaysVipProgramList = []
    }
  },
  methods: {
    liveProgramFilter(schedule) {
      return schedule.startTime.seconds * 1000 < Date.parse(new Date()) + 30 * 60 * 1000
    },
    getFourOrEightPrograms(programList) {
      if (!programList) {
        return null
      }
      if (programList.length > 8) {
        return programList.slice(0, 8)
      } else {
        return programList.slice(0, 4)
      }
    },
    getProgramListBetweenHours(startHour, startMin, endHour, endMin) {
      const first = new Date()
      const last = new Date()
      first.setHours(startHour, startMin, 0, 0)
      last.setHours(endHour, endMin, 0, 0)
      const schedules = this.fromNowInDayScheduleList.filter(item => {
        return item.startTime.seconds * 1000 >= first && item.startTime.seconds * 1000 <= last
      })
      const programs = []
      schedules.forEach(schedule => {
        const program = this.fromTodayProgramList.find(item => item.id === schedule.programId)
        if (program && !programs.some(pro => pro.id === program.id)) {
          programs.push({ ...program, schedule: schedule })
        }
      })
      return programs.sort(sortByRankDesc)
    }

  }

}
</script>

<style>

.links {
  padding-top: 15px;
}
</style>
