<template>
  <div v-if="program">
    <div class="py-4 w-100">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item class="shorten-text" style="max-width: 70%;">
          <span>{{ program.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <div slot="header">
        <div class="row mb-2">
          <div class="col-sm-4 col-md-3 text-center">
            <img class="img-fluid " :src="program.logo" :alt="program.name">
          </div>
          <div class="col-sm-8 col-md-9">
            <div class="color-primary bold mt-1">{{ program.name }}</div>
            <div>
              <span>{{ COMMON.CATEGORY }}: </span><el-tag v-for="(item, index) in program.categories" :key="index" size="small" effect="dark" type="info" style="margin: 2px;">
                {{ item | getCategory }}
              </el-tag>
            </div>
            <p class="smaller-font-size">{{ program.description }}</p>
          </div>
        </div>
      </div>
      <h5>{{ COMMON.PROGRAM_SCHEDULE_NEXT_DAYS }}</h5>
      <el-table :data="scheduleList" size="small" border stripe fit style="width: 100%">
        <el-table-column
          :label="COMMON.CHANNEL"
          :min-width="44"
        >
          <template slot-scope="{row}">
            <el-link
              class="break-word"
              @click="viewChannelDetail({id: row.channelId, name: row.channelName})"
            >{{ row.channelName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="COMMON.START"
          align="center"
          :min-width="28"
        >
          <template slot-scope="{row}">
            <span class="break-word">{{ row.startTime.seconds | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="COMMON.END"
          align="center"
          :min-width="28"
        >
          <template slot-scope="{row}">
            <span class="break-word">{{ row.endTime.seconds | parseTime }}</span>
          </template>
        </el-table-column>

      </el-table>

    </el-card>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { parseVNTime } from '@/assets/utils/index'
import { FB } from '@/assets/utils/constant'

export default {
  filters: {
    parseTime(time) {
      return parseVNTime(time, '{d}/{m}/{y} {h}:{i}{a}', true, true)
    }
  },
  asyncData({ store, params }) {
    const startOfDate = new Date()
    startOfDate.setHours(0, 0, 0, 0)
    const milliSecondsOneDay = 24 * 60 * 60 * 1000
    const startOfDateInSeconds = Date.parse(startOfDate)
    const promise0 = FB.programRef.where('schedules', 'array-contains', startOfDateInSeconds).orderBy('name', 'asc').get()
    const promise1 = FB.programRef.where('schedules', 'array-contains', startOfDateInSeconds + milliSecondsOneDay).orderBy('name', 'asc').get()
    const now = new Date()
    const programId = params.id.split('-').pop().trim()

    const promise2 = FB.scheduleRef.where('programId', '==', programId)
      .where('startTime', '>=', FB.timestamp.fromDate(now))
      .orderBy('startTime', 'asc').get()
    return Promise.all([promise0, promise1, promise2]).then(results => {
      const todayProgramList = []
      const nextDaysProgramList = []
      results[0].forEach(program => {
        todayProgramList.push({ ...program.data(), id: program.id })
      })
      results[1].forEach(program => {
        nextDaysProgramList.push({ ...program.data(), id: program.id })
      })
      const programList = todayProgramList.concat(nextDaysProgramList)
      const program = programList.find(item => item.id === programId)
      const scheduleList = []
      results[2].forEach(doc => {
        const schedule = { ...doc.data(), id: doc.id }
        scheduleList.push(schedule)
      })

      store.dispatch('app/setTodayProgramList', todayProgramList)
      store.dispatch('app/setNextDaysProgramList', nextDaysProgramList)
      return { program, programId, scheduleList }
    })
  },
  data() {
    return {
      program: null,
      programId: null,
      scheduleList: null
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      todayProgramList: 'todayProgramList',
      nextDaysProgramList: 'nextDaysProgramList'
    })
  },
  watch: {
  },
  created() {
    // const promise1 = this.fetchAllProgramByDate(new Date())
    // const promise2 = this.fetchAllProgramNextDays(this.COMMON.NEXT_DAYS_SHOW_NUM)
    // Promise.all([promise1, promise2]).then(results => {
    //   this.$store.dispatch('app/setTodayProgramList', results[0])
    //   this.$store.dispatch('app/setNextDaysProgramList', results[1])
    //   const programList = this.todayProgramList.concat(this.nextDaysProgramList)
    //   this.programId = this.$route.params.id.split('-').pop().trim()
    //   this.program = programList.find(item => item.id === this.programId)
    //   this.fetchScheduleList()
    // })
  },
  methods: {
    fetchScheduleList() {
      const now = new Date()
      this.$store.dispatch('app/fetchScheduleList',
        { programId: this.programId, startTime: now, orderBy: ['startTime', 'asc'] }).then(list => {
        list.forEach(schedule => {
          schedule.channel = this.channelList.find(item => item.id === schedule.channelId)
        })
        this.scheduleList = list
      })
    }
  }
}
</script>
