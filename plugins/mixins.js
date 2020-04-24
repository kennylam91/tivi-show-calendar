import Vue from 'vue'
import { COMMON } from '@/assets/utils/constant'
import { firebase } from '@/MyFireBase'

Vue.mixin({
  data() {
    return {
      COMMON
    }
  },
  methods: {
    viewChannelDetail(channel) {
      const name = channel.name.split(' ').join('-').trim()
      this.$router.push({ path: `/lich-chieu/${name}-${channel.id}` })
    },
    viewProgramDetail(program) {
      const name = program.name.split(' ').join('-').trim()
      this.$router.push({ path: `/chuong-trinh/${name}-${program.id}` })
    },
    fetchScheduleList(channelId, date) {
      return new Promise((resolve, reject) => {
        const start = date
        start.setHours(0, 0, 0, 0)
        const startTimestamp = firebase.firestore.Timestamp.fromDate(start)

        const end = date
        end.setHours(23, 59, 59, 999)
        const endTimestamp = firebase.firestore.Timestamp.fromDate(end)

        this.$store.dispatch('app/fetchScheduleList',
          { channelId: channelId, startTime: startTimestamp, endTime: endTimestamp }).then(scheduleList => {
          resolve(scheduleList)
        })
      })
    },
    fetchAllProgramByDate(date) {
      debugger
      const todayPrograms = []
      if (!this.channelList) {
        this.$store.dispatch('app/fetchChannelList')
      }
      if (!this.programList) {
        this.$store.dispatch('app/fetchProgramList', {})
      }
      return new Promise((resolve, reject) => {
        this.fetchScheduleList(null, date).then(scheduleList => {
          for (const schedule of scheduleList) {
            const foundProgram = this.programList.find(pro => pro.id === schedule.programId)
            if (foundProgram) {
              todayPrograms.push({ ...foundProgram })
            }
          }
          resolve(todayPrograms)
        })
      })
    },
    fetchAllProgramNextDays(nextDays) {
      const now = new Date()
      const start = new Date(now.setHours(23, 59, 59, 0))
      const programList = []
      const startTimestamp = firebase.firestore.Timestamp.fromDate(start)

      const period = Date.parse(now) + Number(nextDays) * 24 * 60 * 60 * 1000
      const end = new Date(Date.parse(start) + period)
      const endTimestamp = firebase.firestore.Timestamp.fromDate(end)

      return new Promise((resolve, reject) => {
        this.$store.dispatch('app/fetchScheduleList',
          { channelId: null, startTime: startTimestamp, endTime: endTimestamp }).then(scheduleList => {
          for (const schedule of scheduleList) {
            const foundProgram = this.programList.find(pro => pro.id === schedule.programId)
            if (foundProgram) {
              programList.push({ ...foundProgram })
            }
          }
          resolve(programList)
        })
      })
    }
  }
})
