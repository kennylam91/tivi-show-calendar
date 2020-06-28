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
  if (voteAvg > 8.5) {
    return 4
  } else if (voteAvg > 7) {
    return 3
  } else if (voteAvg > 5.5) {
    return 2
  } else {
    return 1
  }
}

export const mapGenre = (genre) => {
  const map = new Map([
    [28, 13], [12, 17], [16, 20], [35, 12], [80, 16], [99, 8], [10751, 31], [9648, 30],
    [10749, 21], [878, 14], [10770, 2], [10752, 19], [14, 14]
  ])
  const categories = []
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
