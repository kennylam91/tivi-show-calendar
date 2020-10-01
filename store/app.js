import { FB } from '@/assets/utils/constant'
import { trimObject } from '../assets/utils'
import { Channel } from '@/assets/model/Channel'
import { Schedule } from '@/assets/model/Schedule'
import axios from 'axios'
import { THE_MOVIE_DB } from '../assets/utils/constant'
import { createChannel } from '@/api/channel'

// import { ProgramSearchForm } from '@/assets/model/ProgramSearchForm'

export const state = () => ({
  channelList: null,
  scheduleList: null,
  programList: null,
  todayVipProgramList: null,
  todayProgramList: null,
  nextDaysVipProgramList: null,
  nextDaysProgramList: null,
  todayScheduleList: null,
  nextDaysScheduleList: null,
  fromTodayProgramList: null,
  fromNowInDayProgramList: null,
  fromNowInDayScheduleList: null,
  programSearchQuery: {
    name: '',
    channels: [],
    categories: [],
    ranks: []
  },
  loading: false,
  todayProgramSearchForm: null,
  nextDaysProgramSearchForm: null
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
  },
  SET_FROM_TODAY_PROGRAM_LIST: (state, value) => {
    state.fromTodayProgramList = value
  },
  SET_FROM_NOW_IN_DAY_PROGRAM_LIST: (state, value) => {
    state.fromNowInDayProgramList = value
  },
  SET_FROM_NOW_IN_DAY_SCHEDULE_LIST: (state, value) => {
    state.fromNowInDayScheduleList = value
  },
  SET_PROGRAM_SEARCH_QUERY: (state, value) => {
    state.programSearchQuery = value
  },
  SET_LOADING: (state, value) => {
    state.loading = value
  },
  SET_TODAY_PROGRAM_SEARCH_FORM: (state, value) => {
    state.todayProgramSearchForm = value
  },
  SET_NEXTS_DAY_PROGRAM_SEARCH_FORM: (state, value) => {
    state.nextDaysProgramSearchForm = value
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
  setFromTodayProgramList({ commit }, value) {
    commit('SET_FROM_TODAY_PROGRAM_LIST', value)
  },
  setFromNowInDayProgramList({ commit }, value) {
    commit('SET_FROM_NOW_IN_DAY_PROGRAM_LIST', value)
  },
  setFromNowInDayScheduleList({ commit }, value) {
    commit('SET_FROM_NOW_IN_DAY_SCHEDULE_LIST', value)
  },
  setProgramSearchQuery({ commit }, value) {
    commit('SET_PROGRAM_SEARCH_QUERY', value)
  },
  setLoading({ commit }, value) {
    commit('SET_LOADING', value)
  },
  setTodayProgramSearchForm({ commit }, value) {
    commit('SET_TODAY_PROGRAM_SEARCH_FORM', value)
  },
  setNextDaysProgramSearchForm({ commit }, value) {
    commit('SET_NEXTS_DAY_PROGRAM_SEARCH_FORM', value)
  },
  fetchChannelList({ commit }) {
    return new Promise((resolve, reject) => {
      FB.channelRef.orderBy('name', 'asc').get().then(list => {
        const channelList = []
        list.forEach((doc) => {
          const channel = Channel.getInstanceFromDoc(doc)
          channelList.push(channel)
        })
        commit('SET_CHANNEL_LIST', channelList)
        resolve(channelList)
      })
    })
  },
  // request: {channelId, programId, startTime, endTime, orderBy:[field, order], limit}
  fetchScheduleList({ state, dispatch }, request) {
    dispatch('setLoading', true)
    let scheduleQuery = FB.scheduleRef
    if (request.channelId) {
      // fetch program list of this channel
      scheduleQuery = scheduleQuery.where('channelId', '==', request.channelId)
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
          const schedule = Schedule.getInstanceFromDoc(doc)
          // const schedule = { ...doc.data(), id: doc.id }
          scheduleList.push(schedule)
        })
        dispatch('setLoading', false)
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
    return createChannel(channel)
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
  },
  /*
  @params: query:{movieTitle, }
  */
  searchProgramOnTheMovieDb({ commit }, query) {
    return new Promise((resolve, reject) => {
      axios.get(THE_MOVIE_DB.API + '/search/movie/?api_key=' + THE_MOVIE_DB.API_KEY + '&query=' + query.movieTitle + '&language=vi')
        .then(({ data }) => resolve(data))
        .catch(err => reject(err))
    })
  },

  fetchImagesFromTheMovieDb({ commit }, query) {
    return new Promise((resolve, reject) => {
      axios.get(THE_MOVIE_DB.API + '/movie/' + query.movieId + '/images?api_key=' + THE_MOVIE_DB.API_KEY)
        .then(({ data }) => resolve(data))
        .catch(err => reject(err))
    })
  }

}
