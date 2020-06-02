import { FB } from '@/assets/utils/constant'
// import { trimObject } from '../assets/utils'
import { getStartOfDayInGMT7 } from '@/assets/utils/index'
import { sortByRankDesc } from '@/assets/utils/index'
export const state = () => ({

})

export const mutations = {

}

export const actions = {

  nuxtServerInit({ dispatch }) {
    const now = new Date()
    const milliSecondsOneDay = 24 * 60 * 60 * 1000
    const nowInMilli = Date.parse(now)
    // Cong them 7h vi server mui gio 0, tu 0 -> 7h sang gio VN se bi loi xac dinh
    // gio bat dau cua ngay
    const timeZoneOffsetInMin = now.getTimezoneOffset()
    const nowInMilliPlus7Hours = nowInMilli + 7 * 60 * 60 * 1000 + timeZoneOffsetInMin * 60 * 1000
    const startOfDateInGMT7 = getStartOfDayInGMT7(new Date(nowInMilliPlus7Hours))
    const channelFetchPm = dispatch('app/fetchChannelList')
    const todayPgFetchPm = FB.programRef.where('schedules', 'array-contains', startOfDateInGMT7)
      .orderBy('name', 'asc').get()
    const nextDaysPgFetchPm = FB.programRef
      .where('schedules', 'array-contains', startOfDateInGMT7 + milliSecondsOneDay)
      .orderBy('name', 'asc').get()

    const now2 = new Date()
    const before30Mins = Date.parse(now2) - 30 * 60 * 1000
    const nowInGMT7Timestamp = FB.timestamp.fromMillis(before30Mins)
    const startOfNextDayInGMT7 = startOfDateInGMT7 + milliSecondsOneDay
    const startOfNextDayInGMT7Timestamp = FB.timestamp.fromMillis(startOfNextDayInGMT7)
    const fromtNowScheduleFetchPromise = dispatch('app/fetchScheduleList', {
      startTime: nowInGMT7Timestamp,
      endTime: startOfNextDayInGMT7Timestamp
    })

    return Promise.all([channelFetchPm, todayPgFetchPm, nextDaysPgFetchPm, fromtNowScheduleFetchPromise])
      .then(results => {
        const todayProgramList = []
        const nextDaysProgramList = []
        results[1].forEach(program => {
          todayProgramList.push({ ...program.data(), id: program.id })
        })
        results[2].forEach(program => {
          nextDaysProgramList.push({ ...program.data(), id: program.id })
        })
        const todayAndNextDaysProgramList = todayProgramList.concat(nextDaysProgramList)
        const fromTodayProgramList = []
        const map = new Map()
        for (const program of todayAndNextDaysProgramList) {
          if (!map.has(program.id)) {
            map.set(program.id, true)
            fromTodayProgramList.push(program)
          }
        }
        const fromNowScheduleList = results[3]
        const fromNowInDayProgramList = []
        const scheduleMap = new Map()
        for (const schedule of fromNowScheduleList) {
          if (!scheduleMap.has(schedule.programId)) {
            scheduleMap.set(schedule.programId, true)
            const foundProgram = fromTodayProgramList.find(item => item.id === schedule.programId)
            if (foundProgram) {
              fromNowInDayProgramList.push(foundProgram)
            }
          }
        }
        dispatch('app/setChannelList', results[0])
        dispatch('app/setTodayProgramList', todayProgramList.sort(sortByRankDesc))
        dispatch('app/setNextDaysProgramList', nextDaysProgramList.sort(sortByRankDesc))
        dispatch('app/setFromTodayProgramList', fromTodayProgramList.sort(sortByRankDesc))
        dispatch('app/setFromNowInDayProgramList', fromNowInDayProgramList.sort(sortByRankDesc))
        dispatch('app/setFromNowInDayScheduleList', fromNowScheduleList)
      })
  }
  // user login

}
