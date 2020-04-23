import Vue from 'vue'
import { COMMON } from '@/assets/utils/constant'
import { firebase } from '@/FireBase'

Vue.mixin({
  data() {
    return {
      COMMON
    }
  },
  methods: {
    viewChannelDetail(channelId) {
      this.$router.push({ path: `/channels/view/${channelId}` })
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
      const todayPrograms = []
      if (!this.channelList) {
        this.$store.dispatch('app/fetchChannelList')
      }
      if (!this.programList) {
        this.$store.dispatch('app/fetchProgramList')
      }
      return new Promise((resolve, reject) => {
        this.fetchScheduleList(null, date).then(scheduleList => {
          for (const schedule of scheduleList) {
            const foundProgram = this.programList.find(pro => pro.id === schedule.programId)
            if (foundProgram) {
              todayPrograms.push(foundProgram)
            }
          }
          resolve(todayPrograms)
        })
      })
    }
  }
})
