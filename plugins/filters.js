import Vue from 'vue'
import { categoryMap } from '@/assets/utils/constant'

Vue.filter('uppercaseAll', val => val.toUpperCase())
Vue.filter('uppercaseFirst', string => string.charAt(0).toUpperCase() + string.slice(1))
Vue.filter('lowercaseAll', val => val.toLowerCase())
Vue.filter('getCategory', val => categoryMap.get(val))
Vue.filter('shortenName', val => {
  if (val) {
    const array = val.split('(')
    return array[0].trim()
  }
  return ''
})
Vue.filter('getVNTranslateName', name => {
  if (name) {
    const start = name.indexOf('(')
    const end = name.indexOf(')')
    if (start >= 0 && end >= 0) {
      return name.substring(start + 1, end).trim()
    } else {
      return name
    }
  }
})

