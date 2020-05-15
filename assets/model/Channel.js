export class Channel {
  constructor(id, name, desc, logo, isVip) {
    this.id = id
    this.name = name
    this.description = desc
    this.logo = logo
    this.isVip = isVip
  }
  getId() { return this.id }
  getName() { return this.name }
  getDescription() { return this.description }
  getLogo() { return this.logo }
  getIsVip() { return this.isVip }
  setId(value) { this.id = value }
  setName(value) { this.name = value }
  setDescription(value) { this.description = value }
  setLogo(value) { this.logo = value }
  setIsVip(value) { this.isVip = value }

  static getInstance(doc) {
    return {
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      logo: doc.data().logo,
      isVip: doc.data().isVip
    }
  }
}

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
