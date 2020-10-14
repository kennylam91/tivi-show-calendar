const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  channelList: state => state.app.channelList,
  vipChannelList: state => (state.app.channelList &&
    state.app.channelList.filter(item => item.vip).slice(0, 8)) || [],
  programList: state => state.app.programList,
  todayVipProgramList: state => state.app.todayVipProgramList,
  nextDaysVipProgramList: state => state.app.nextDaysVipProgramList,
  todayProgramList: state => state.app.todayProgramList,
  nextDaysProgramList: state => state.app.nextDaysProgramList,
  todayScheduleList: state => state.app.todayScheduleList,
  nextDaysScheduleList: state => state.app.nextDaysScheduleList,
  fromTodayProgramList: state => state.app.fromTodayProgramList,
  fromNowInDayProgramList: state => state.app.fromNowInDayProgramList,
  fromNowInDayScheduleList: state => state.app.fromNowInDayScheduleList,
  programSearchQuery: state => state.app.programSearchQuery,
  loading: state => state.app.loading,
  todayProgramSearchForm: state => state.app.todayProgramSearchForm,
  nextDaysProgramSearchForm: state => state.app.nextDaysProgramSearchForm,
  categories: state => state.app.categories,
  scheduleStats: state => state.app.scheduleStats
}
export default getters
