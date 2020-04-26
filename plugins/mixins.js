import Vue from 'vue'
import { COMMON, CATEGORIES } from '@/assets/utils/constant'
import { firebase } from '@/MyFireBase'

const sortByName = (a, b) => {
  if (a.name > b.name) {
    return 1
  } else if (a.name < b.name) {
    return -1
  } else {
    return 0
  }
}

Vue.mixin({
  data() {
    return {
      COMMON,
      CATEGORIES
    }
  },
  methods: {
    viewChannelDetail(channel) {
      const name = channel.name.split(' ').join('-').trim()
      this.$router.push({ path: `/lich-chieu/${name}-${channel.id}` })
    },
    viewProgramDetail(program) {
      let id
      if (!program.name) {
        program.name = program.programName
        id = program.programId
      } else {
        id = program.id
      }
      const name = program.name.split(' ').join('-').trim()
      this.$router.push({ path: `/chi-tiet-chuong-trinh/${name}-${id}` })
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
      const programList = []
      if (!this.channelList) {
        this.$store.dispatch('app/fetchChannelList')
      }
      if (!this.programList) {
        this.$store.dispatch('app/fetchProgramList', {})
      }
      return new Promise((resolve, reject) => {
        this.fetchScheduleList(null, date).then(scheduleList => {
          this.$store.dispatch('app/setTodayScheduleList', scheduleList)
          for (const schedule of scheduleList) {
            const foundProgram = this.programList.find(pro => pro.id === schedule.programId)
            if (foundProgram && !programList.some(item => item.id === foundProgram.id)) {
              programList.push({ ...foundProgram })
            }
          }
          programList.sort(sortByName)
          resolve(programList)
        })
      })
    },
    fetchAllProgramNextDays(nextDays) {
      const now = new Date()
      const start = new Date(now.setHours(23, 59, 59, 0))
      const programList = []
      const startTimestamp = firebase.firestore.Timestamp.fromDate(start)
      const period = Number(nextDays) * 24 * 60 * 60 * 1000
      const end = new Date(Date.parse(start) + period)
      const endTimestamp = firebase.firestore.Timestamp.fromDate(end)

      return new Promise((resolve, reject) => {
        this.$store.dispatch('app/fetchScheduleList',
          { channelId: null, startTime: startTimestamp, endTime: endTimestamp }).then(scheduleList => {
          this.$store.dispatch('app/setNextDaysScheduleList', scheduleList)
          for (const schedule of scheduleList) {
            const foundProgram = this.programList.find(pro => pro.id === schedule.programId)
            if (foundProgram && !programList.some(item => item.id === foundProgram.id)) {
              programList.push({ ...foundProgram })
            }
          }
          programList.sort(sortByName)
          resolve(programList)
        })
      })
    },
    updateTodayProgramList() {
      this.fetchAllProgramByDate(new Date()).then(list => {
        this.$store.dispatch('app/setTodayProgramList', list)
      })
    },
    updateNextDaysProgramList() {
      this.fetchAllProgramNextDays(this.COMMON.NEXT_DAYS_SHOW_NUM).then(list => {
        this.$store.dispatch('app/setNextDaysProgramList', list)
      })
    },
    getTodayProgramView() {
      this.$router.push({ path: `/chuong-trinh-hom-nay` })
    },
    getNextDayProgramView() {
      this.$router.push({ path: `/chuong-trinh-sap-chieu` })
    },
    moveToChannelListView() {
      this.$router.push({ path: '/danh-sach-kenh' })
    }
  }
})
