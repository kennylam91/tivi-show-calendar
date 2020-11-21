/** @class */
export class ScheduleStats {
  constructor() {
    this.channelId = null
    this.date = ''
    this.total = 0
  }
}

/** @class */
export class AutoUpdateForm {
  constructor(channelName = '', channelId = null, importDate = '') {
    this.channelName = channelName
    this.channelId = channelId
    this.importDate = importDate
    // this.apiSource = this.getApiSource()
  }

  getApiSource() {
    // if ([1, 2, 4, 5, 6, 20].includes(this.channelId)) {
    //   return 'SCTV'
    // } else if ([11, 12, 13, 18, 19].includes(this.channelId)) {
    //   return 'VTV'
    // } else {
    //   return null
    // }
    // return 
  }
}
