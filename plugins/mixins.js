import Vue from 'vue'
import { COMMON, FB, CATEGORIES } from '@/assets/utils/constant'
// import { firebase } from '@/MyFireBase'

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
        const startTimestamp = FB.timestamp.fromDate(start)

        const end = date
        end.setHours(23, 59, 59, 999)
        const endTimestamp = FB.timestamp.fromDate(end)

        this.$store.dispatch('app/fetchScheduleList',
          { channelId: channelId,
            startTime: startTimestamp,
            endTime: endTimestamp }).then(scheduleList => {
          resolve(scheduleList)
        })
      })
    },
    fetchAllProgramByDate(date) {
      if (!this.channelList) {
        this.$store.dispatch('app/fetchChannelList')
      }
      return new Promise((resolve, reject) => {
        const startOfDate = date
        startOfDate.setHours(0, 0, 0, 0)
        const startOfDateInSeconds = Date.parse(startOfDate)
        this.$store.dispatch('app/fetchProgramList',
          { schedules: [startOfDateInSeconds] }).then(list => {
          resolve(list)
        })
      })
    },
    fetchAllProgramNextDays(nextDays) {
      const now = new Date()
      const todayStart = new Date(now.setHours(0, 0, 0, 0))
      const milliSecondsOneDay = 24 * 60 * 60 * 1000
      const nextDayArr = []
      for (let i = 1; i <= nextDays; i++) {
        nextDayArr.push(Date.parse(todayStart) + milliSecondsOneDay * i)
      }

      return new Promise((resolve, reject) => {
        this.$store.dispatch('app/fetchProgramList',
          { schedules: nextDayArr }).then(list => {
          resolve(list)
        })
      })
    },
    // fetchAllProgramTodayAndNextDays(nextDays) {
    //   const now = new Date()
    //   const todayStart = new Date(now.setHours(0, 0, 0, 0))
    //   const milliSecondsOneDay = 24 * 60 * 60 * 1000
    //   const nextDayArr = [Date.parse(todayStart)]
    //   for (let i = 1; i <= nextDays; i++) {
    //     nextDayArr.push(Date.parse(todayStart) + milliSecondsOneDay * i)
    //   }

    //   return new Promise((resolve, reject) => {
    //     this.$store.dispatch('app/fetchProgramList',
    //       { schedules: nextDayArr }).then(list => {
    //       resolve(list)
    //     })
    //   })
    // },
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
    },
    filterCategory(value, row, column) {
      return row.categories.includes(value)
    },
    handleLogout() {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.push({ path: this.redirect || '/' })
      })
    },
    moveToChannelManageView(channel) {
      this.$router.push({ path: `/channels/manage/${channel.id}` })
    },
    fetchTodayProgramList() {
      this.fetchAllProgramByDate(new Date()).then(list => {
        this.$store.dispatch('app/setTodayProgramList', list)
      })
    },
    fetchNextDaysProgramList() {
      this.fetchAllProgramNextDays(this.COMMON.NEXT_DAYS_SHOW_NUM).then(list => {
        this.$store.dispatch('app/setNextDaysProgramList', list)
      })
    },
    concatTwoProgramList(firstArr, secondArr) {
      const finalArr = [].concat(firstArr)
      for (const second of secondArr) {
        if (!firstArr.some(item => item.id === second.id)) {
          finalArr.push(second)
        }
      }
      return finalArr
    },
    sortByName: (a, b) => {
      if (a.name > b.name) {
        return 1
      } else if (a.name < b.name) {
        return -1
      } else {
        return 0
      }
    }
  }
})
