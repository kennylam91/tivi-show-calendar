export class Schedule {
  constructor() {
    this.id = null
    this.channelId = null
    this.programId = null
    this.channelName = null
    this.programName = null
    this.startTime = null
    this.endTime = null
    this.categories = []
  }
  setChannelId(value) { this.channelId = value }
  // get instance object from firebase document
  static getInstanceFromDoc(doc) {
    return {
      id: doc.id,
      channelId: doc.data().channelId,
      programId: doc.data().programId,
      channelName: doc.data().channelName,
      programName: doc.data().programName,
      startTime: doc.data().startTime,
      endTime: doc.data().endTime,
      categories: doc.data().categories
    }
  }
}
