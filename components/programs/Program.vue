<template>
  <div>
    <el-card
      shadow="hover"
      :body-style="{ padding: '5px','text-align':'center' }"
    >
      <div class="mb-2">
        <el-tooltip
          :content="program.enName"
          :open-delay="300"
          placement="top"
          effect="dark"
        >
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
        </el-tooltip>
      </div>
      <el-link
        class="mb-2 w-100"
        type="primary"
        :underline="false"
        @click="viewProgramDetail(program)"
      >
        <el-tooltip
          :content="program.enName"
          :open-delay="300"
          placement="bottom-start"
          effect="dark"
        >
          <div
            class="bold smaller-font-size shorten-text hoverDarkBlue"
            style="color: #000000c2"
          >
            {{ program.name }}
          </div>
        </el-tooltip>

      </el-link>

      <div>
        <span
          v-for="(item, index) in getCategoryList(program)"
          :key="index"
          class="smaller-font-size color-primary"
        >
          {{ item.name }}
          <span v-show="isShowDivider(index,program)">
            <el-divider
              direction="vertical"
            />
          </span>
        </span>

      </div>
      <div v-if="live && program.schedules && program.schedules.length > 0" class="smaller-font-size mb-1">
        <span class="color-success">
          {{ program.schedules[0].channelName }}</span>
        <el-divider direction="vertical" />
        <span class="color-danger">
          {{ parseTime(program.schedules[0].startTime) }}
        </span>
      </div>
      <el-rate
        v-model="program.rank"
        disabled
        text-color="#ff9900"
        :max="4"
      />
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
