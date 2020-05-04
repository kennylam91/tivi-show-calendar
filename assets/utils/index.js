import { COMMON } from './constant.js'

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

/**
 * Remove all space in object properties if that property is a string
 * @param {object} source
 */
export function trimObject(source) {
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
  if (a.rank < b.rank) {
    return 1
  } else if (a.rank > b.rank) {
    return -1
  } else {
    return 0
  }
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
