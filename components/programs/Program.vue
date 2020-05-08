<template>
  <div>
    <el-card
      shadow="hover"
      :body-style="{ padding: '5px','text-align':'center',background: '#6062662e' }"
    >
      <el-link
        v-if="program.logo"
        :underline="false"
        @click="viewProgramDetail(program)"
      >
        <img
          class="img-fluid"
          :src="program.logo"
          :alt="program.name"
        >
      </el-link>
      <div v-else>
        <img class="img-fluid" src="https://via.placeholder.com/400x225" :alt="program.name">
      </div>
      <div
        class="color-info smaller-font-size my-2 shorten-text"
      >
        {{ program.name | shortenName | uppercaseAll }}
      </div>
      <el-link
        class="mb-2 w-100"
        type="primary"
        :underline="false"
        @click="viewProgramDetail(program)"
      >
        <el-tooltip
          :content="program.name | getVNTranslateName"
          placement="bottom"
          effect="dark"
        >
          <div class="bold smaller-font-size programName" style="color: #000000c2">
            {{ program.name | getVNTranslateName | uppercaseAll }}
          </div>
        </el-tooltip>
      </el-link>

      <div>
        <el-tag
          v-for="(item, index) in getCategoryList(program.categories)"
          :key="index"
          size="small"
          effect="dark"
          :type="categoryTagMap.get(item)"
          :class="{'categoryTag':!small, 'categoryTagSmall': small }"
        >
          {{ item | getCategory }}
        </el-tag>
      </div>
      <div v-if="live" class="small-font-size mb-1 bold" style="color: #000000b5;">
        <div>{{ COMMON.CHANNEL }}: {{ program.schedule.channelName }}</div>
        <div>{{ COMMON.TIME }}: {{ parseTime(program.schedule.startTime.seconds) }}-{{ parseTime(program.schedule.endTime.seconds) }}</div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { parseVNTime } from '@/assets/utils/index'
import { categoryTagMap } from '@/assets/utils/constant'

export default {
  props: {
    program: {
      required: true,
      type: Object
    },
    live: {
      required: false,
      type: Boolean,
      default: () => false
    },
    small: {
      required: false,
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      categoryTagMap: categoryTagMap
    }
  },
  computed: {

  },
  methods: {
    getCategoryList(categories) {
      if (categories) {
        if (categories.length <= 2) {
          return categories
        } else if (categories.includes(1)) {
          return categories.filter(item => item !== 1).slice(0, 2)
        } else {
          return categories.slice(0, 2)
        }
      } else {
        return []
      }
    },
    parseTime(time) {
      return parseVNTime(time, '{H}:{i}', true, true)
    }
    // getTagType(item){
    //   const tagTypeMap = new Map([
    //     []
    //   ])
    // }
  }
}
</script>
