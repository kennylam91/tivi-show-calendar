export class Program {
  constructor() {
    this.id = null
    this.name = null
    this.description = null
    this.channels = []
    this.categories = []
    this.logo = null
    this.rank = 1
    this.schedules = []
  }
  // get instance object from firebase document
  static getInstanceFromDoc(doc) {
    return {
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      channels: doc.data().channels,
      categories: doc.data().categories,
      logo: doc.data().logo,
      rank: doc.data().rank,
      schedules: doc.data().schedules
    }
  }
}
