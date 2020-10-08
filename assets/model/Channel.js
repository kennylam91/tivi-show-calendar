export class Channel {
  constructor(id, name, desc, logoUrl, vip, networkId) {
    this.id = id
    this.name = name
    this.description = desc
    this.logoUrl = logoUrl
    this.vip = vip
    this.networkId = networkId
  }
  // getId() { return this.id }
  // getName() { return this.name }
  // getDescription() { return this.description }
  // getLogo() { return this.logo }
  // getIsVip() { return this.isVip }
  // setId(value) { this.id = value }
  // setName(value) { this.name = value }
  // setDescription(value) { this.description = value }
  // setLogo(value) { this.logo = value }
  // setIsVip(value) { this.isVip = value }

  static getInstanceFromDoc(doc) {
    return {
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      logoUrl: doc.data().logo,
      isVip: doc.data().isVip,
      schedules: doc.data().schedules
    }
  }
}

