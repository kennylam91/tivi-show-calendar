import { FB } from '@/assets/utils/constant'
// import { trimObject } from '../assets/utils'
import { getStartOfDayInGMT7 } from '@/assets/utils/index'
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
    const todayPgFetchPm = FB.programRef.where('schedules', 'array-contains', startOfDateInGMT7).orderBy('name', 'asc').get()
    const nextDaysPgFetchPm = FB.programRef.where('schedules', 'array-contains', startOfDateInGMT7 + milliSecondsOneDay).orderBy('name', 'asc').get()

    return Promise.all([channelFetchPm, todayPgFetchPm, nextDaysPgFetchPm]).then(results => {
      const todayProgramList = []
      const nextDaysProgramList = []
      results[1].forEach(program => {
        todayProgramList.push({ ...program.data(), id: program.id })
      })
      results[2].forEach(program => {
        nextDaysProgramList.push({ ...program.data(), id: program.id })
      })
      dispatch('app/setChannelList', results[0])
      dispatch('app/setTodayProgramList', todayProgramList)
      dispatch('app/setNextDaysProgramList', nextDaysProgramList)
    })
  }
  // user login

}
