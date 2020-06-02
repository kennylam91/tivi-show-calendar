export class Channel {
  constructor(id, name, desc, logo, isVip, schedules) {
    this.id = id
    this.name = name
    this.description = desc
    this.logo = logo
    this.isVip = isVip
    this.schedules = schedules
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

  static getInstanceFromDoc(doc) {
    return {
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      logo: doc.data().logo,
      isVip: doc.data().isVip,
      schedules: doc.data().schedules
    }
  }
}

