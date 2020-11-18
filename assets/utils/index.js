import { COMMON, programRankMap, categoryMap } from './constant.js'

/**
 * Parse Time to any format
 * @param time : (Object, string, number)
 * @param vformat(String) :{d}/{m}/{y} {h}:{i}{a}
 * @param pad(Boo) : 1 -> 01
 * @param isFourDigitYear(Boo)
 * @returns time string
 */
export function parseVNTime(time, vformat, pad, isFourDigitYear) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = vformat || '{d}/{m}/{y} {h}:{i}{a}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const hours = date.getHours()
  let formatObj
  if (isFourDigitYear) {
    formatObj = {
      d: date.getDate(),
      m: date.getMonth() + 1,
      y: date.getFullYear(),
      h: hours < 12 ? hours : hours - 12,
      H: hours,
      i: date.getMinutes(),
      a: hours < 12 ? 'AM' : 'PM',
      w: date.getDay()
    }
  } else {
    formatObj = {
      d: date.getDate(),
      m: date.getMonth() + 1,
      y: date.getFullYear() % 100,
      h: hours < 12 ? hours : hours - 12,
      H: hours,
      i: date.getMinutes(),
      a: hours < 12 ? 'AM' : 'PM',
      w: date.getDay()
    }
  }

  const time_str = format.replace(/{([dmyhHiaw])+}/g, (result, key) => {
    const value = formatObj[key]
    if (key === 'w') {
      return [COMMON.SUNDAY, COMMON.MONDAY, COMMON.TUESDAY, COMMON.WEDNESDAY, COMMON.THURSDAY, COMMON.FRIDAY, COMMON.SATURDAY][value]
    }
    if (pad) {
      return value.toString().padStart(2, '0')
    }
    return value.toString()
  })
  return time_str
}
// Pattern
// {d} Day of the month as a numeric value (01 to 31)
// {D} Day of the month as a numeric value (0 to 31)
// {H} Hour (00 to 23)
// {h} Hour (00 to 11)
// {I} Minutes (0 to 59)
// {i} Minutes (00 to 59)
// {k} Hour (0 to 23)
// {l} Hour (00 to 11)
// {g} Month name in full (January to December)
// {m} Month name as a numeric value (00 to 12)
// {M} Month name as a numeric value (0 to 12)
// {p} AM or PM
// {S} Seconds (0 to 59)
// {s} Seconds (00 to 59)
// {w} Weekday name in full (Sunday to Saturday, Sunday=0 and Saturday=6)
// {Y} Year as a numeric, 4-digit value
// {y} Year as a numeric, 2-digit value
export function parseTime(timeInput, format) {
  if (arguments.length === 0 || !timeInput) {
    return null
  }
  let time
  if (typeof timeInput === 'object') {
    time = timeInput
  } else {
    return null
  }
  const formatObj = {
    d: time.getDate().toString().padStart(2, 0),
    D: time.getDate().toString(),
    m: (time.getMonth() + 1).toString().padStart(2, 0),
    M: (time.getMonth() + 1).toString(),
    g: (time.getMonth() + 1).toString(),
    y: (time.getFullYear() % 100).toString().padStart(2, 0),
    Y: time.getFullYear().toString(),
    H: time.getHours().toString().padStart(2, 0),
    h: time.getHours() < 12 ? time.getHours() : time.getHours() - 12,
    l: time.getHours() < 12 ? time.getHours().toString().padStart(2, 0) : (time.getHours() - 12).toString().padStart(2, 0),
    k: time.getHours().toString(),
    i: time.getMinutes().toString().padStart(2, 0),
    I: time.getMinutes().toString(),
    s: time.getSeconds().toString().padStart(2, 0),
    S: time.getSeconds().toString(),
    w: time.getDay().toString(),
    p: time.getHours() < 12 ? 'AM' : 'PM'
  }
  const timeStr = format.replace(/{([dmMyYHiIsSDkghlwp])+}/g, (result, key) => {
    if (key === 'g') {
      const monthMap = new Map([
        ['1', 'January'], ['2', 'February'], ['3', 'March'], ['4', 'April'], ['5', 'May'], ['6', 'June'],
        ['7', 'July'], ['8', 'August'], ['9', 'September'], ['10', 'October'], ['11', 'November'], ['12', 'December']
      ])
      return monthMap.get(formatObj[key])
    }
    if (key === 'w') {
      const weekdayMap = new Map([
        ['0', 'Thứ bảy'], ['1', 'Thứ hai'], ['2', 'Thứ ba'], ['3', 'Thứ tư'], ['4', 'Thứ năm'],
        ['5', 'Thứ sáu'], ['6', 'Thứ bảy']
      ])
      return weekdayMap.get(formatObj[key])
    }
    return formatObj[key]
  })
  return timeStr
}

/**
 * Remove all space in object properties if that property is a string
 * @param {object} source
 */
export function trimObject(source) {
  if (!source) {
    return null
  }
  Object.keys(source).forEach(function(key) {
    source[key] = typeof source[key] === 'string' ? source[key].trim() : source[key]
  })
  return source
}

export const sortByStartTime = (a, b) => {
  if (a.startTime.seconds > b.startTime.seconds) {
    return 1
  } else if (a.startTime.seconds < b.name.seconds) {
    return -1
  } else {
    return 0
  }
}
export const sortByRankDesc = (a, b) => {
  return b.rank - a.rank
}

// return in milliseconds
export const getStartOfDayInGMT7 = (datetime) => {
  const now = datetime
  now.setHours(0, 0, 0, 0)

  const nowInMilli = Date.parse(now)
  // convert now to GMT timezone
  const timeZoneOffsetInMin = now.getTimezoneOffset()
  const timeZoneDiffInMin = (-7 * 60) - timeZoneOffsetInMin
  const startOfDateInGMT7 = nowInMilli + timeZoneDiffInMin * 60 * 1000
  return startOfDateInGMT7
}

// return in milliseconds
export const getTimeInGMT7 = (time) => {
  const timeInMilli = Date.parse(time)
  // convert now to GMT timezone
  const timeZoneOffsetInMin = time.getTimezoneOffset()
  const timeZoneDiffInMin = (-7 * 60) - timeZoneOffsetInMin
  const startOfDateInGMT7 = timeInMilli + timeZoneDiffInMin * 60 * 1000
  return startOfDateInGMT7
}

// convert Vietnamese to English
export const convertVNToEN = (str) => {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const sortByName = (a, b) => {
  if (a.name > b.name) {
    return 1
  } else if (a.name < b.name) {
    return -1
  } else {
    return 0
  }
}

export const getStartOfDate = date => {
  const start = date
  start.setHours(0, 0, 0, 0)
  return start
}

export const getEndOfDate = date => {
  const end = date
  end.setHours(23, 59, 59, 999)
  return end
}

export const removeFirstWordOfSen = (sen) => {
  if (!sen) {
    return null
  } else {
    const arr = sen.split(' ')
    const newSen = arr.slice(1, arr.length)
    return newSen.join(' ')
  }
}

export const getProgramEnTitle = (title) => {
  if (title) {
    return title.split('-')[0].trim()
  }
  return ''
}

export const getProgramNameFromMovieTitle = (movie) => {
  if (movie) {
    const enName = movie.original_title.replace('-', ' ')
    const viName = movie.title.replace('-', ' ')
    if (enName !== viName) {
      return enName + ' - ' + viName
    } else {
      return enName
    }
  }
  return ''
}

export const getRankFromVoteAvg = (voteAvg) => {
  if (voteAvg >= 8) {
    return 5
  } else if (voteAvg >= 7) {
    return 4
  } else if (voteAvg >= 6) {
    return 3
  } else if (voteAvg >= 5) {
    return 2
  } else {
    return 1
  }
}

export const mapGenre = (genre) => {
  const map = new Map([
    [28, 13], [12, 17], [16, 20], [35, 12], [80, 16], [99, 8], [10751, 31], [9648, 30],
    [10749, 21], [878, 14], [10770, 2], [10752, 19], [14, 37], [18, 36], [36, 15],
    [27, 11], [10402, 10], [53, 37]
  ])
  const categories = [1]
  for (const item of genre) {
    const found = map.get(item)
    if (found) {
      categories.push(found)
    }
  }
  return categories
}

export const getEmbedLinkFromYoutubeVideoId = (videoId) => {
  return `<iframe width="1280" height="720" src="https://www.youtube.com/embed/` + videoId + `" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
}

/**
* @param {Program} program
* @param  {ProgramSearchForm } programSearchForm
*/
export function filterByName(program, programSearchForm) {
  if (programSearchForm && programSearchForm.searchName) {
    return program.name.includes(programSearchForm.searchName.toUpperCase()) ||
     program.enName.includes(programSearchForm.searchName.toUpperCase())
  }
  return true
}
/**
* @param {Program} program
* @param  {ProgramSearchForm } programSearchForm
*/
export function filterByCategory(program, programSearchForm) {
  if (programSearchForm && programSearchForm.categoryCodes.length > 0) {
    return isTwoArrayHaveSameElement(program.categoryCodes, programSearchForm.categoryCodes)
  }
  return true
}
/**
* @param {Program} program
* @param  {ProgramSearchForm } programSearchForm
*/
export function filterByRank(program, programSearchForm) {
  if (programSearchForm && programSearchForm.ranks.length > 0) {
    return isTwoArrayHaveSameElement([program.rank], programSearchForm.ranks)
  }
  return true
}

/**
 * convert to String Filter
 * @param {ProgramSearchForm} searchForm
 * @returns {string[]}
 */
export function getFilterDesc(searchForm) {
  if (!searchForm) {
    return []
  }
  const resultArr = []
  const fields = Object.keys(searchForm)
  fields.forEach(field => {
    const fieldValue = searchForm[field]
    if (field === 'searchName' && fieldValue) {
      resultArr.push(new ProgramFilter(field, fieldValue, 'Tên: ' + fieldValue))
    } else if (field === 'ranks' && fieldValue && fieldValue.length > 0) {
      fieldValue.forEach(rank => {
        resultArr.push(new ProgramFilter(field, rank, 'Đánh giá: ' + programRankMap.get(rank)))
      })
    } else if (field === 'categoryCodes' && fieldValue && fieldValue.length > 0) {
      fieldValue.forEach(cat => {
        resultArr.push(new ProgramFilter(field, cat, 'Thể loại: ' + categoryMap.get(cat)))
      })
    }
  })
  return resultArr
}

class ProgramFilter {
  constructor(field, fieldValue, tagName) {
    this.field = field
    this.fieldValue = fieldValue
    this.tagName = tagName
  }
}

function isTwoArrayHaveSameElement(first, second) {
  if (!first || !second) {
    return false
  } else {
    if (!first.length || !second.length) {
      return false
    } else {
      for (const i of first) {
        for (const j of second) {
          if (i === j) {
            return true
          }
        }
      }
      return false
    }
  }
}

export class ProgramSearchForm {
  constructor() {
    this.searchName = ''
    this.categoryCodes = []
    this.ranks = []
    this.startTime = null
    this.endTime = null
  }
}
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
    this.year = null
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
      schedules: doc.data().schedules,
      year: doc.data().year
    }
  }
}
export class ScheduleModel {
  constructor() {
    this.startTime = new Date()
    this.endTime = new Date()
    this.programName = ''
    this.channelId = 0
    this.channelName = ''
    this.viName = ''
    this.enName = ''
  }
}
/**
 *
 * @param {string} pattern
 * @param {string} scheduleInput
 * @param {Object} importDate
 * @param {Object} channel
 * @returns {ScheduleModel}
 */
export function getScheduleArray(pattern, scheduleInput, importDate, channel) {
  let dataArray = []
  scheduleInput = scheduleInput.replaceAll(/NOW SHOWING\s+/g, '')
  if (pattern === 'h:mm:PM en') {
    const arr = scheduleInput.trim().split('\n')
    for (let i = 0; i < arr.length; i += 2) {
      dataArray.push(arr[i] + ' ' + arr[i + 1])
    }
    scheduleInput = dataArray.join('\n')
  } else if (pattern === 'arr[t,vi,en]') {
    dataArray = scheduleInput.replaceAll('"', '').split('],')
  } else {
    dataArray = scheduleInput.trim().split('\n')
  }
  const scheduleArr = []
  // ["02:15","Ngôi Nhà Lớn","Casa Grande"  ],
  if (pattern === 'arr[t,vi,en]') {
    for (const str of dataArray) {
      const array = str.replaceAll('[', '').replaceAll(']', '').split(',')
      const hour = array[0].split(':')[0]
      const min = array[0].split(':')[1]
      const en = array[2].trim() ? array[2].trim() : array[1].trim()
      const vi = array[1].trim()
      const startTime = importDate.setHours(hour, min, 0, 0)
      const endTime = new Date(startTime)
      endTime.setHours(24, 0, 0, 0)
      if (scheduleArr.length > 0) {
        scheduleArr[scheduleArr.length - 1].endTime = startTime
      }
      const newSchedule = {
        startTime, endTime, programName: vi + ((en && en !== vi) ? (' - ' + en) : ''),
        channelId: channel.id, channelName: channel.name, programId: null,
        viName: vi, enName: en
      }
      scheduleArr.push(newSchedule)
    }
  } else if (pattern === 'htv') {
    dataArray = scheduleInput.split('\n')
    for (let i = 0; i < dataArray.length; i += 2) {
      const time = dataArray[i]
      const { hour, min } = getStartTimeFromString(time)
      const startTime = importDate.setHours(hour, min, 0, 0)
      const endTime = new Date(startTime)
      endTime.setHours(24, 0, 0, 0)
      if (scheduleArr.length > 0) {
        scheduleArr[scheduleArr.length - 1].endTime = startTime
      }
      const en = ''
      const vi = dataArray[i + 1]
      const newSchedule = {
        startTime, endTime,
        programName: (vi + ((en && en !== vi) ? (' - ' + en) : '')),
        channelId: channel.id, channelName: channel.name,
        programId: null, viName: vi, enName: en
      }
      scheduleArr.push(newSchedule)
    }
  } else if (pattern === 'vtv html') {
    const doc = new DOMParser().parseFromString(scheduleInput, 'text/xml')
    const docTimes = doc.getElementsByClassName('time')
    const docPrograms = doc.getElementsByTagName('p')
    const timeArr = Array.from(docTimes).map(item => item.innerHTML)
    const programArr = Array.from(docPrograms).map(item => {
      const childArr = item.childNodes
      let program
      if (childArr[1].textContent.trim().replaceAll(/[\s]{2,}/g, ' ')) {
        program = childArr[0].textContent + ' : ' + childArr[1].textContent
      } else {
        program = childArr[0].textContent
      }
      return program.trim().replaceAll(/[\s]{2,}/g, ' ')
    })
    for (let i = 0; i < timeArr.length; i++) {
      const time = timeArr[i]
      const { hour, min } = getStartTimeFromString(time)
      const startTime = importDate.setHours(hour, min, 0, 0)
      const endTime = new Date(startTime)
      endTime.setHours(24, 0, 0, 0)
      if (scheduleArr.length > 0) {
        scheduleArr[scheduleArr.length - 1].endTime = startTime
      }
      const en = ''
      const vi = programArr[i]
      const newSchedule = {
        startTime, endTime,
        programName: (vi + ((en && en !== vi) ? (' - ' + en) : '')),
        channelId: channel.id, channelName: channel.name,
        programId: null, viName: vi, enName: en
      }
      scheduleArr.push(newSchedule)
    }
  } else {
    for (const str of dataArray) {
      // schedule: '00:00	BIẾN ĐI, ÔNG ANH! (GO BROTHER)'
      const item = str.substring(0, 6) + str.substring(6).replaceAll(/:/gi, ' : ').replaceAll(/-/gi, ' - ')
      const array = item.split(/\s+/)
      const startTimeStr = array[0]
      const { hour, min } = getStartTimeFromString(startTimeStr)
      const startTime = importDate.setHours(hour, min, 0, 0)
      const endTime = new Date(startTime)
      endTime.setHours(24, 0, 0, 0)

      if (scheduleArr.length > 0) {
        scheduleArr[scheduleArr.length - 1].endTime = startTime
      }
      const { vi, en } = getNamesFromString(pattern, item)
      const newSchedule = {
        startTime, endTime,
        programName: (vi + ((en && en !== vi) ? (' - ' + en) : '')),
        channelId: channel.id, channelName: channel.name,
        programId: null, viName: vi, enName: en
      }
      scheduleArr.push(newSchedule)
    }
  }
  return scheduleArr
}

/**
 * @param {string} startTimeStr
 * @returns {{min: number, hour: number}}
 */
function getStartTimeFromString(startTimeStr) {
  const timeSplitArr = startTimeStr.split(':')
  let hour = Number(timeSplitArr[0])
  const min = Number(timeSplitArr[1].replaceAll(/[A-Z a-z]/g, ''))
  const isAM = (startTimeStr + '').match(/AM/)
  const isPM = (startTimeStr + '').match(/PM/)
  if (hour >= 12 && isAM) {
    hour -= 12
  }
  if (hour < 12 && isPM) {
    hour += 12
  }
  return { min, hour }
}

/**
 *
 * @param {string} pattern
 * @param {string[]} array
 * @param {string} item
 * @return {vi: {string}, en: {string}}
 */
function getNamesFromString(pattern, item) {
  let vi = ''
  let en = ''
  let splitIndex
  const array = item.split(/\s+/)
  if (pattern === 'en : vi') {
    // en = array[1] => :
    // vi = : => end
    splitIndex = array.indexOf(':')
  } else if (pattern === 'en - vi') {
    splitIndex = array.indexOf('-')
  }
  if (splitIndex > -1) {
    en = array.slice(1, splitIndex).join(' ')
    vi = array.slice(splitIndex + 1).join(' ')
  } else {
    vi = array.slice(1).join(' ')
  }
  if (pattern === '(en)vi') {
    const openChar = item.indexOf('(')
    const closeChar = item.indexOf(')')
    en = item.substring(openChar + 1, closeChar)
    vi = item.substring(closeChar + 1)
  }
  if (pattern === 'h:mm:PM en') {
    en = array.slice(1).join(' ')
  }
  return { vi, en }
}

export function getProgramSearchName(name) {
  return name.replace(/[&:-\\)\\(]/g, '')
    .replace(/[\s]+/g, ' ').toUpperCase()
}

