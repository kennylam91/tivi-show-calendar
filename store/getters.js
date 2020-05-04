const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  channelList: state => state.app.channelList,
  programList: state => state.app.programList,
  todayVipProgramList: state => state.app.todayVipProgramList,
  nextDaysVipProgramList: state => state.app.nextDaysVipProgramList,
  todayProgramList: state => state.app.todayProgramList,
  nextDaysProgramList: state => state.app.nextDaysProgramList,
  todayScheduleList: state => state.app.todayScheduleList,
  nextDaysScheduleList: state => state.app.nextDaysScheduleList,
  fromTodayProgramList: state => state.app.fromTodayProgramList,
  fromNowInDayProgramList: state => state.app.fromNowInDayProgramList,
  fromNowInDayScheduleList: state => state.app.fromNowInDayScheduleList
}
export default getters
