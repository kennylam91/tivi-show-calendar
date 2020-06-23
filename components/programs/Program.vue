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
            src="~assets/images/400x225.png"
            class="img-fluid"
            :alt="program.name"
          >
        </el-link>

      </div>
      <el-link
        class="mb-2 w-100"
        type="primary"
        :underline="false"
        @click="viewProgramDetail(program)"
      >
        <el-tooltip
          :content="program.name"
          :open-delay="300"
          placement="bottom-start"
          effect="dark"
        >
          <div
            class="bold smaller-font-size shorten-text hoverDarkBlue"
            style="color: #000000c2"
          >
            {{ program.name | getVNTranslateName | uppercaseAll }}
          </div>
        </el-tooltip>

      </el-link>

      <div>
        <span
          v-for="(item, index) in getCategoryList(program)"
          :key="index"
          class="smaller-font-size color-primary"
        >
          {{ item | getCategory }}
          <span v-show="isShowDivider(index,program)">
            <el-divider
              direction="vertical"
            />
          </span>
        </span>

      </div>
      <div v-if="live" class="smaller-font-size mb-1">
        <span class="color-success">{{ program.schedule.channelName }}</span>
        <el-divider direction="vertical" />
        <span class="color-primary">{{ parseTime(program.schedule.startTime.seconds) }}-{{ parseTime(program.schedule.endTime.seconds) }}</span>
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
          return categories.filter(item => ![1, 26, 23, 24, 25, 27, 34, 35].includes(item)
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
      return index === 0 && this.getCategoryList(program).length >= 2
    }
    // getTagType(item){
    //   const tagTypeMap = new Map([
    //     []
    //   ])
    // }
  }
}
</script>
