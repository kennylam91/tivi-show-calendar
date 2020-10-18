import Vue from 'vue'
import { COMMON, CATEGORIES } from '@/assets/utils/constant'
import { convertVNToEN } from '@/assets/utils'
import { parseVNTime } from '@/assets/utils/index'

Vue.mixin({
  data() {
    return {
      COMMON,
      CATEGORIES,
      defaultTags: [COMMON.SCHEDULE + ' HBO', COMMON.SCHEDULE + ' FOX MOVIES',
        COMMON.SCHEDULE + ' CINEMAX', COMMON.SCHEDULE + ' AXN', COMMON.SCHEDULE + ' DISCOVERY',
        COMMON.SCHEDULE + ' RED BY HBO', COMMON.TODAY_SCHEDULE, COMMON.TODAY_SCHEDULE_2]

    }
  },
  methods: {
    viewChannelDetail(channel) {
      const name = channel.name.split(' ').join('-').trim()
      this.$router.push({ path: `/lich-chieu/${name}_${channel.id}` })
    },
    viewProgramDetail(program) {
      let id
      if (!program.name) {
        program.name = program.programName
        id = program.programId
      } else {
        id = program.id
      }
      const name = (program.name + ' ' + program.enName).split(/[\s:]+/).join('-').trim()
      const enConvertedName = convertVNToEN(name)
      this.$router.push({ path: `/chi-tiet-chuong-trinh/${enConvertedName}_${id}` })
      // this.$store.dispatch('app/setLoading', true)
      // setTimeout(() => {
      //   this.$store.dispatch('app/setLoading', false)
      // }, 500)
      // this.$store.dispatch('app/setLoading', false)
    },
    fetchScheduleList(channelId, date) {
      const start = date
      start.setHours(0, 0, 0, 0)
      const end = new Date(date.getTime())
      end.setHours(24, 0, 0, 0)
      return new Promise((resolve, reject) => {
        this.$store.dispatch('app/searchSchedules',
          { channelId: channelId,
            startTime: start,
            endTime: end,
            page: 1,
            limit: 99999
          }).then(res => {
          resolve(res)
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
    filterRank(value, row, column) {
      return row.rank === value
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

    isMovie(program) {
      const cats = program.categoryCodes
      if (!cats) {
        return false
      }
      return cats.includes(1) || cats.includes(23) || cats.includes(24) ||
      cats.includes(25) || cats.includes(26) || cats.includes(27)
    },
    isSciExp(program) {
      const cats = program.categoryCodes
      if (!cats) {
        return false
      }
      return cats.includes(5) || cats.includes(7) || cats.includes(8) ||
      cats.includes(9)
    },
    filterByTime(program) {
      if (this.searchByDateProgramList.length === 0) {
        return true
      } else {
        return this.searchByDateProgramList.some(item => item.id === program.id)
      }
    },
    // 09:30
    convertStringToTimestamp(string, date) {
      if (!string) return null
      const arr = string.trim().split(':')
      const hour = arr[0]
      const min = arr[1]
      date.setHours(hour, min, 0, 0)
      return date
    },
    getStartEndOfToday() {
      const startOfToday = (new Date()).setHours(0, 0, 0, 0)
      const endOfToday = (new Date()).setHours(24, 0, 0, 0)
      return {
        startOfToday,
        endOfToday
      }
    },
    moveToProgramDetail(programId) {
      this.$router.push(`/programs/edit/${programId}`)
    },
    parseVNTime(time) {
      return parseVNTime(time, '{H}:{i}', true, true)
    },
    endOfToday() {
      return (new Date()).setHours(24, 0, 0, 0)
    },
    startOfToday() {
      return (new Date()).setHours(0, 0, 0, 0)
    }

  }
})
