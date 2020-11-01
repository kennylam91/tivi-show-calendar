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
    this.apiSource = ([1, 2, 4, 5, 6, 20].includes(channelId)) ? 'SCTV' : 'VTV'
  }
}
