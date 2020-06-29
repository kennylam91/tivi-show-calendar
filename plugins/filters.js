import Vue from 'vue'
import { categoryMap } from '@/assets/utils/constant'
import { programRankMap } from '../assets/utils/constant'

Vue.filter('uppercaseAll', val => val.toUpperCase())
Vue.filter('uppercaseFirst', string => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1)
  } else {
    return null
  }
}
)
Vue.filter('lowercaseAll', val => val.toLowerCase())
Vue.filter('getCategory', val => {
  const found = categoryMap.get(Number(val))
  return found || ''
})
Vue.filter('shortenName', val => {
  if (val) {
    const array = val.split('-')
    return array[0].trim()
  }
  return ''
})
Vue.filter('getVNTranslateName', val => {
  if (val) {
    const array = val.split('-')
    return array[1] ? array[1].trim() : array[0]
  }
  return ''
})

Vue.filter('getRankText', val => {
  if (val) {
    return programRankMap.get(val)
  }
})

Vue.filter('getRankTagType', val => {
  if (val) {
    const map = new Map([
      [1, 'danger'],
      [2, 'warning'],
      [3, 'primary'],
      [4, 'success']
    ])
    return map.get(val)
  }
  return 'danger'
})

