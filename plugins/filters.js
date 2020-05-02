import Vue from 'vue'
import { categoryMap } from '@/assets/utils/constant'

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
Vue.filter('getCategory', val => categoryMap.get(Number(val)))
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

