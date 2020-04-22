import Vue from 'vue'
import { categoryMap } from '@/assets/utils/constant'

Vue.filter('uppercaseAll', val => val.toUpperCase())
Vue.filter('uppercaseFirst', string => string.charAt(0).toUpperCase() + string.slice(1))
Vue.filter('lowercaseAll', val => val.toLowerCase())
Vue.filter('getCategory', val => categoryMap.get(val))

