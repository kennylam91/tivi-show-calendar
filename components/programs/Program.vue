<template>
  <div>
    <el-card
      shadow="hover"
      :body-style="{ padding: '5px','text-align':'center' }"
    >
      <div class="mb-2">
        <el-link
          :underline="false"
          @click="viewProgramDetail(program)"
        >
          <img
            v-if="program.logo"
            class="img-fluid"
            :src="program.logo"
            :alt="program.name"
          >
          <div v-else>
            <img
              class="img-fluid"
              src="https://via.placeholder.com/400x225"
              :alt="program.name"
            >
          </div>
        </el-link>

      </div>
      <el-link
        class="mb-2 w-100"
        type="primary"
        :underline="false"
        @click="viewProgramDetail(program)"
      >
        <div class="bold smaller-font-size programName" style="color: #000000c2">
          {{ program.name | getVNTranslateName | uppercaseAll }}
        </div>
      </el-link>

      <div>
        <span
          v-for="(item, index) in getCategoryList(program.categories)"
          :key="index"
          class="small-font-size color-info"
        >
          {{ item | getCategory }}
          <el-divider v-if="index===0 && getCategoryList(program.categories).length >=2" direction="vertical" />
        </span>

      </div>
      <div v-if="live" class="small-font-size mb-1 color-info ">
        <span>{{ program.schedule.channelName }}</span>
        <el-divider direction="vertical" />
        {{ parseTime(program.schedule.startTime.seconds) }}-{{ parseTime(program.schedule.endTime.seconds) }}
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
