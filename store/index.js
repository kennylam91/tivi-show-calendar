export const state = () => ({

})

export const mutations = {

}

export const actions = {

  nuxtServerInit({ dispatch }) {
    const channelFetchPm = dispatch('app/fetchChannelList')
    return Promise.all([channelFetchPm])
      .then(results => {
        dispatch('app/setChannelList', results[0].content)
      })
  }
  // user login

}
