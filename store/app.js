// import { trimObject } from '../assets/utils'
// import { Channel } from '@/assets/model/Channel'
// import { Schedule } from '@/assets/model/Schedule'
import axios from 'axios'
import { THE_MOVIE_DB } from '../assets/utils/constant'
import request from '@/assets/utils/request'
import { ProgramSearchForm } from '@/assets/utils/index'
import { ScheduleStats } from '../assets/model/model'
import { getProgramSearchName } from '@/assets/utils'

export const state = () => ({
  channelList: null,
  scheduleList: null,
  programList: null,
  todayNoonProgramList: null,
  toNightProgramList: null,
  todayProgramList: null,
  broadCastingProgramList: null,
  nextDaysVipProgramList: null,
  nextDaysProgramList: null,
  todayScheduleList: null,
  nextDaysScheduleList: null,
  fromTodayProgramList: null,
  fromNowInDayProgramList: null,
  fromNowInDayScheduleList: null,
  programSearchQuery: new ProgramSearchForm(),
  loading: false,
  todayProgramSearchForm: new ProgramSearchForm(),
  nextDaysProgramSearchForm: new ProgramSearchForm(),
  categories: null,
  scheduleStats: null
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
  SET_TODAY_NOON_PROGRAM_LIST: (state, value) => {
    state.todayNoonProgramList = value
  },
  SET_TONIGHT_PROGRAM_LIST: (state, value) => {
    state.toNightProgramList = value
  },
  SET_NEXT_DAYS_VIP_PROGRAM_LIST: (state, value) => {
    state.nextDaysVipProgramList = value
  },
  SET_BROAD_CASTING_PROGRAM_LIST: (state, value) => {
    state.broadCastingProgramList = value
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
  },
  SET_CATEGORIES: (state, value) => {
    state.categories = value
  },
  SET_SCHEDULE_STATS: (state, value) => {
    state.scheduleStats = value
  },
  UPDATE_SCHEDULE_STATS: (state, value) => {
    /** @type ScheduleStats[] */
    const scheduleStats = state.scheduleStats
    const found = scheduleStats.find(s => s.channelId === value.channelId && s.date === value.date)
    if (found) {
      found.total = value.total
    } else {
      scheduleStats.push(value)
    }
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
  setTodayNoonProgramList({ commit }, value) {
    commit('SET_TODAY_NOON_PROGRAM_LIST', value)
  },
  setTonightProgramList({ commit }, value) {
    commit('SET_TONIGHT_PROGRAM_LIST', value)
  },
  setNextDaysVipProgramList({ commit }, value) {
    commit('SET_NEXT_DAYS_VIP_PROGRAM_LIST', value)
  },
  setBroadCastingProgramList({ commit }, value) {
    commit('SET_BROAD_CASTING_PROGRAM_LIST', value)
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
  setScheduleStats({ commit }, value) {
    commit('SET_SCHEDULE_STATS', value)
  },
  updateScheduleStats({ commit, state }, /** @type ScheduleStats */ value) {
    commit('UPDATE_SCHEDULE_STATS', value)
  },
  fetchChannelList({ commit }) {
    return new Promise((resolve, reject) => {
      request({
        url: '/channels/get-all',
        method: 'post',
        data: { page: 1, limit: 999999 }
      }).then(res => {
        commit('SET_CHANNEL_LIST', res)
        resolve(res)
      })
    })
  },
  // request: {startTimeFrom, startTimeTo}
  fetchScheduleStats({ commit }, data) {
    return request({
      url: '/stats/channels/total-schedules-daily',
      method: 'post',
      data
    })
  },
  // request: {channelId, programId, startTime, endTime, orderBy:[field, order], limit}
  searchSchedules({ state, dispatch }, data) {
    return request({
      url: '/schedules/search',
      method: 'post',
      data: data
    })
  },
  importSchedules({ state, dispatch }, data) {
    return request({
      url: '/schedules/import',
      method: 'post',
      data: data,
      timeout: 30000
    })
  },
  createOrUpdateSchedule({ commit }, schedule) {
    return request({
      url: '/schedules',
      method: 'post',
      data: schedule
    })
  },
  // request={channelId: }
  fetchChannel({ commit }, channelId) {
    return request({
      url: '/channels/' + channelId,
      method: 'get'
    })
  },
  // data={channelIds:[1,2] }
  deleteChannels({ commit }, data) {
    return request({
      url: '/channels/delete-multi',
      method: 'post',
      data
    })
  },
  // request = {programId}
  fetchProgram({ commit }, programId) {
    return request({
      url: '/programs/' + programId,
      method: 'get'
    })
  },
  // request ={programIds: []}
  deletePrograms({ commit }, data) {
    return request({
      url: '/programs/delete-multi',
      method: 'post',
      data
    })
  },
  // request = {searchName, categoryCodes, ranks, isBroadCasting, getStartTimeFrom, getStartTimeTo,
  // page, limit, sortBy, sortDirection(DESC, ASC)}
  searchProgram({ commit }, data) {
    const formattedData = { ...data, searchName: getProgramSearchName(data.searchName) }
    return request({
      url: '/programs/search',
      method: 'post',
      data: formattedData
    })
  },
  fetchTodayPrograms({ commit }, data) {
    return request({
      url: '/programs/today',
      method: 'post',
      data
    })
  },
  fetchTomorrowPrograms({ commit }, data) {
    return request({
      url: '/programs/tomorrow',
      method: 'post',
      data
    })
  },
  createOrUpdateChannel({ commit }, channel) {
    return request({
      url: '/channels',
      method: 'post',
      data: channel
    })
  },
  // request: {scheduleId}
  deleteSchedules({ commit }, data) {
    return request({
      url: '/schedules/delete-multi',
      method: 'post',
      data
    })
  },
  createOrUpdateProgram({ commit }, program) {
    return request({
      url: '/programs',
      method: 'post',
      data: program
    })
  },
  fetchCategories({ commit }, data) {
    return new Promise((resolve, reject) => {
      return request({
        url: '/categories/get-all',
        method: 'post',
        data
      }).then(res => {
        commit('SET_CATEGORIES', res)
        resolve(res)
      })
    })
  },
  logHomepage({ commit }) {
    return request({
      url: '/homepage',
      method: 'get'
    })
  },
  clearScheduleCache({ commit }) {
    return request({
      url: '/schedules/clear-cache',
      method: 'post'
    })
  },
  autoUpdateSchedule({ commit }, data) {
    return request({
      url: '/schedules/auto-update',
      method: 'post',
      data
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
