// import { FB } from '@/assets/utils/constant'
// import { trimObject } from '../assets/utils'

export const state = () => ({

})

export const mutations = {

}

export const actions = {

  nuxtServerInit({ dispatch }) {
    return Promise.all([dispatch('app/fetchChannelList')])
  }
  // user login

}
