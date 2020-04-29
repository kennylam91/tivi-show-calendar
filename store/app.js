import { FB } from '@/assets/utils/constant'
import { trimObject } from '../assets/utils'

export const state = () => ({
  channelList: null,
  scheduleList: null,
  programList: null,
  todayVipProgramList: null,
  todayProgramList: null,
  nextDaysVipProgramList: null,
  nextDaysProgramList: null,
  todayScheduleList: null,
  nextDaysScheduleList: null
})

export const mutations = {
  SET_CHANNEL_LIST: (state, value) => {
    state.channelList = value
  },
  SET_SCHEDULE_LIST: (state, value) => {
    state.scheduleList = value
  },
  SET_PROGRAM_LIST: (state, value) => {
    state.programList = value
  },
  SET_TODAY_VIP_PROGRAM_LIST: (state, value) => {
    state.todayVipProgramList = value
  },
  SET_NEXT_DAYS_VIP_PROGRAM_LIST: (state, value) => {
    state.nextDaysVipProgramList = value
  },
  SET_TODAY_PROGRAM_LIST: (state, value) => {
    state.todayProgramList = value
  },
  SET_NEXT_DAYS_PROGRAM_LIST: (state, value) => {
    state.nextDaysProgramList = value
  },
  SET_TODAY_SCHEDULE_LIST: (state, value) => {
    state.todayScheduleList = value
  },
  SET_NEXT_DAYS_SCHEDULE_LIST: (state, value) => {
    state.nextDaysScheduleList = value
  }

}

export const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo

    return new Promise((resolve, reject) => {
      if (username === 'admin' && password === '123456') {
        commit('SET_TOKEN', 'admin-token')
        resolve()
      } else {
        reject('Error')
      }
    })
  },
  setChannelList({ commit }, value) {
    commit('SET_CHANNEL_LIST', value)
  },
  setScheduleList({ commit }, value) {
    commit('SET_SCHEDULE_LIST', value)
  },
  setProgramList({ commit }, value) {
    commit('SET_PROGRAM_LIST', value)
  },
  setTodayVipProgramList({ commit }, value) {
    commit('SET_TODAY_VIP_PROGRAM_LIST', value)
  },
  setNextDaysVipProgramList({ commit }, value) {
    commit('SET_NEXT_DAYS_VIP_PROGRAM_LIST', value)
  },
  setTodayProgramList({ commit }, value) {
    commit('SET_TODAY_PROGRAM_LIST', value)
  },
  setNextDaysProgramList({ commit }, value) {
    commit('SET_NEXT_DAYS_PROGRAM_LIST', value)
  },
  setTodayScheduleList({ commit }, value) {
    commit('SET_TODAY_SCHEDULE_LIST', value)
  },
  setNextDaysScheduleList({ commit }, value) {
    commit('SET_NEXT_DAYS_SCHEDULE_LIST', value)
  },
  fetchChannelList({ commit }) {
    return new Promise((resolve, reject) => {
      FB.channelRef.orderBy('name', 'asc').get().then(list => {
        const channelList = []
        list.forEach((channel) => {
          channelList.push({ ...channel.data(), id: channel.id })
        })
        commit('SET_CHANNEL_LIST', channelList)
        resolve(channelList)
      })
    })
  },
  // request: {channelId, programId, startTime, endTime, orderBy:[field, order], limit}
  fetchScheduleList({ state, dispatch }, request) {
    let programList
    if (state.todayProgramList && state.nextDaysProgramList) {
      programList = state.todayProgramList.concat(state.nextDaysProgramList)
    }
    let scheduleQuery = FB.scheduleRef
    if (request.channelId) {
      // fetch program list of this channel
      scheduleQuery = scheduleQuery.where('channelId', '==', request.channelId)
      dispatch('fetchProgramList', { channelId: request.channelId }).then(list => {
        programList = list
      })
    }
    if (request.programId) {
      scheduleQuery = scheduleQuery.where('programId', '==', request.programId)
    }
    if (request.startTime) {
      scheduleQuery = scheduleQuery.where('startTime', '>=', request.startTime)
    }
    if (request.endTime) {
      scheduleQuery = scheduleQuery.where('startTime', '<', request.endTime)
    }
    if (request.orderBy) {
      scheduleQuery = scheduleQuery.orderBy(request.orderBy[0], request.orderBy[1])
    } else {
      scheduleQuery = scheduleQuery.orderBy('startTime')
    }
    if (request.limit) {
      scheduleQuery = scheduleQuery.limit(request.limit)
    }

    return new Promise((resolve, reject) => {
      scheduleQuery.get().then((list) => {
        const scheduleList = []
        list.forEach((doc) => {
          const programId = doc.data().programId
          const schedule = { ...doc.data(), id: doc.id }
          const foundProgram = programList.find(program => program.id === programId)
          if (foundProgram) {
            schedule.programName = foundProgram.name
            schedule.categories = foundProgram.categories
            scheduleList.push(schedule)
          }
        })
        resolve(scheduleList)
      })
    })
  },
  createSchedule({ commit }, schedule) {
    const query = FB.scheduleRef.add(trimObject(schedule))
    return new Promise((resolve, reject) => {
      query.then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateSchedule({ commit }, schedule) {
    const query = FB.scheduleRef.doc(schedule.id).set(trimObject(schedule))
    return new Promise((resolve, reject) => {
      query.then(() => {
        resolve()
      }).catch(err => reject(err))
    })
  },
  // request={channelId: }
  fetchChannel({ commit }, request) {
    return new Promise((resolve, reject) => {
      let channel = null
      FB.channelRef.doc(request.channelId).get().then(doc => {
        channel = { ...doc.data(), id: doc.id }
        resolve(channel)
      })
    })
  },
  // request={channelId: }
  deleteChannel({ commit }, request) {
    return new Promise((resolve, reject) => {
      const query = FB.channelRef.doc(request.channelId).delete()
      query.then(() => {
        resolve()
      }).catch(err => reject(err))
    })
  },
  // request = {programId}
  fetchProgram({ commit }, request) {
    const programQuery = FB.programRef.doc(request.programId)
    return new Promise((resolve, reject) => {
      programQuery.get().then(doc => {
        const program = { ...doc.data(), id: doc.id }
        resolve(program)
      })
    })
  },
  // request ={programId}
  deleteProgram({ commit }, request) {
    return new Promise((resolve, reject) => {
      const query = FB.programRef.doc(request.programId).delete()
      query.then(() => {
        resolve()
      }).catch(err => reject(err))
    })
  },
  // request = {isTodayShow, isNextDaysShow, channelId}
  fetchProgramList({ commit }, request) {
    return new Promise((resolve, reject) => {
      let programQuery = FB.programRef
      if (request.isTodayShow) {
        programQuery = programQuery.where('isTodayShow', '==', true)
      }
      if (request.isNextDaysShow) {
        programQuery = programQuery.where('isNextDaysShow', '==', true)
      }

      if (request.channelId) {
        programQuery = programQuery.where('channels', 'array-contains', request.channelId)
      }
      if (request.schedules) {
        programQuery = programQuery.where('schedules', 'array-contains-any', request.schedules)
      }

      programQuery.orderBy('name', 'asc').get().then(doc => {
        const programList = []
        doc.forEach(program => {
          programList.push({ ...program.data(), id: program.id })
        })
        // commit('SET_PROGRAM_LIST', programList)
        resolve(programList)
      })
    })
  },
  createChannel({ commit }, channel) {
    const query = FB.channelRef.add(trimObject(channel))
    return new Promise((resolve, reject) => {
      query.then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateChannel({ commit }, channel) {
    const query = FB.channelRef.doc(channel.id).set(trimObject(channel))
    return new Promise((resolve, reject) => {
      query.then(() => {
        resolve()
      }).catch(err => reject(err))
    })
  },
  // request: {scheduleId}
  deleteSchedule({ commit }, request) {
    return new Promise((resolve, reject) => {
      const query = FB.scheduleRef.doc(request.scheduleId).delete()
      query.then(() => {
        resolve()
      }).catch(err => reject(err))
    })
  },
  createProgram({ commit }, program) {
    const query = FB.programRef.add(trimObject(program))
    return new Promise((resolve, reject) => {
      query.then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },
  updateProgram({ commit }, program) {
    // check if program.schedules has any value before now => remove it
    const now = Date.parse(new Date()) - 60
    const newArr = []
    if (program.schedules) {
      for (const time of program.schedules) {
        if (time >= now) {
          newArr.push(time)
        }
      }
    }
    program.schedules = newArr
    const query = FB.programRef.doc(program.id).set(trimObject(program))
    return new Promise((resolve, reject) => {
      query.then(() => {
        resolve()
      }).catch(err => reject(err))
    })
  }

}
