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
            v-lazy="program.logo"
            class="img-fluid"
            :alt="program.name"
          >
          <img
            v-else
            src="~assets/images/default-program-picture.png"
            class="img-fluid"
            :alt="program.name"
          >
        </el-link>
      </div>
      <el-link
        class="mb-1 w-100"
        type="primary"
        :underline="false"
        @click="viewProgramDetail(program)"
      >
        <div
          class="bold small-font-size shorten-text hoverDarkBlue"
          style="color: #000000c2"
        >
          {{ program.name }}
        </div>

      </el-link>

      <div v-if="live && program.schedules && program.schedules.length > 0" class="smaller-font-size mb-1 shorten-text">
        <span class="color-danger">
          {{ parseTime(program.schedules[0].startTime) }}~{{ parseTime(program.schedules[0].endTime) }}
          <el-divider direction="vertical" />
        </span>
        <span class="color-success">
          {{ program.schedules[0].channelName }}</span>

      </div>
      <div class="mb-0">
        <el-tag
          v-for="(item, index) in program.categories.filter(c => c.code !== 1).slice(0,2)"
          :key="index"
          size="small"
          effect="dark"
          style="margin: 2px;"
          type="info"
        >
          {{ item.name }}
        </el-tag>
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
    getCategoryList(program) {
      const categories = program.categories
      if (categories) {
        if (categories.length <= 2) {
          return categories
        } else {
          return categories.filter(item => ![1, 26, 23, 24, 25, 27, 34, 35].includes(item.code)
          ).slice(0, 2)
        }
      } else {
        return []
      }
    },
    parseTime(time) {
      return parseVNTime(time, '{H}:{i}', true, true)
    },
    isShowDivider(index, program) {
      return index < this.program.categoryCodes.length - 1
    }
    // getTagType(item){
    //   const tagTypeMap = new Map([
    //     []
    //   ])
    // }
  }
}
</script>
