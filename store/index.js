import { FB } from '@/assets/utils/constant'
// import { trimObject } from '../assets/utils'
import { getStartOfDayInGMT7, getTimeInGMT7 } from '@/assets/utils/index'
export const state = () => ({

})

export const mutations = {

}

export const actions = {

  nuxtServerInit({ dispatch }) {
    const now = new Date()
    const milliSecondsOneDay = 24 * 60 * 60 * 1000
    const startOfDateInGMT7 = getStartOfDayInGMT7(now)
    const channelFetchPm = dispatch('app/fetchChannelList')
    const todayPgFetchPm = FB.programRef.where('schedules', 'array-contains', startOfDateInGMT7)
      .orderBy('name', 'asc').get()
    const nextDaysPgFetchPm = FB.programRef
      .where('schedules', 'array-contains', startOfDateInGMT7 + milliSecondsOneDay)
      .orderBy('name', 'asc').get()

    const nowInGMT7 = getTimeInGMT7(new Date())
    const nowInGMT7Timestamp = FB.timestamp.fromMillis(nowInGMT7)
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
            fromNowInDayProgramList.push(fromTodayProgramList.find(item => item.id === schedule.programId))
          }
        }
        dispatch('app/setChannelList', results[0])
        dispatch('app/setTodayProgramList', todayProgramList)
        dispatch('app/setNextDaysProgramList', nextDaysProgramList)
        dispatch('app/setFromTodayProgramList', fromTodayProgramList)
        dispatch('app/setFromNowInDayProgramList', fromNowInDayProgramList)
        dispatch('app/setFromNowInDayScheduleList', fromNowScheduleList)
      })
  }
  // user login

}
