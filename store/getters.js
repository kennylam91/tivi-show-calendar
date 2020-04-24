const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  channelList: state => state.app.channelList,
  programList: state => state.app.programList,
  todayVipProgramList: state => state.app.todayVipProgramList,
  nextDaysVipProgramList: state => state.app.nextDaysVipProgramList
}
export default getters
