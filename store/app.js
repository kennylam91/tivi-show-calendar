import { FB } from '@/utils/constant'

export const state = () => ({
  channelList: [],
  scheduleList: []
})

export const mutations = {
  SET_CHANNEL_LIST: (state, value) => {
    state.channelList = value
  },
  SET_SCHEDULE_LIST: (state, value) => {
    state.scheduleList = value
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
  fetchChannelList({ commit }) {
    return new Promise((resolve, reject) => {
      FB.channelRef.orderBy('name', 'asc').onSnapshot((snapshot) => {
        const channelList = []
        snapshot.forEach((channel) => {
          channelList.push({ ...channel.data(), id: channel.id })
        })
        commit('SET_CHANNEL_LIST', channelList)
        resolve(channelList)
      })
    })
  },
  fetchScheduleList({ dispatch }, request) {
    const scheduleQuery = FB.scheduleRef.where('channelId', '==', request.channelId).where('startTime', '>=', request.startTime).where('startTime', '<', request.endTime).orderBy('startTime', 'asc')
    return new Promise((resolve, reject) => {
      scheduleQuery.onSnapshot((querySnapshot) => {
        const scheduleList = []
        querySnapshot.forEach((schedule) => {
          const programId = schedule.data().programId
          FB.programRef.doc(programId).onSnapshot(doc => {
            scheduleList.push({ ...schedule.data(), id: schedule.id, programName: doc.data().name, category: doc.data().category })
          })
        })
        console.log(scheduleList)
        resolve(scheduleList)
      })
    })
  },
  fetchChannel({ commit }, request) {
    return new Promise((resolve, reject) => {
      let channel = null
      FB.channelRef.doc(request.channelId).onSnapshot(docSnapshot => {
        channel = { ...docSnapshot.data(), id: docSnapshot.id }
        resolve(channel)
      })
    })
  },
  fetchProgram({ commit }, request) {
    const programQuery = FB.programRef.doc(request.programId)
    return new Promise((resolve, reject) => {
      programQuery.onSnapshot(doc => {
        const program = { ...doc.data(), id: doc.id }
        resolve(program)
      })
    })
  }

}
