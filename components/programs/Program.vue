<template>
  <div>
    <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center',background: '#6062662e' }">
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
      <div v-else class="mb-4">{{ program.name }}</div>
      <div
        class="color-info smaller-font-size my-2 shorten-text"
      >
        {{ program.name | shortenName | uppercaseAll }}
      </div>
      <el-link
        id="programName"
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
          <div class="bold smaller-font-size programName" style="color: purple">
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
          :type="categoryMap.get(item)"
          style="margin: 2px; padding: 0 0px; width: 63px;"
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
    }
  },
  data() {
    return {
      categoryMap: new Map([
        [1, 'primary'], // 'Phim',
        [2, 'primary'], // 'Game show',
        [3, 'primary'], // 'Thực tế',
        [4, 'primary'], // 'Trực tiếp',
        [5, 'info'], // 'Phóng sự',
        [6, 'info'], // 'Tin tức',
        [7, 'info'], // 'Khoa học',
        [8, 'info'], // 'Tài liệu',
        [9, 'primary'], // 'Khám phá',
        [10, 'primary'], // 'Ca nhạc',
        [11, 'danger'], // 'Kinh dị',
        [12, 'success'], // 'Hài hước',
        [13, 'danger'], // 'Hành động',
        [14, 'warning'], // 'Viễn tưởng',
        [15, 'warning'], // 'Thần thoại',
        [16, 'danger'], // 'Hình sự',
        [17, 'success'], // 'Phiên lưu',
        [18, 'warning'], // 'Cổ trang',
        [19, 'danger'], // 'Chiến tranh',
        [20, 'warning'], // 'Hoạt hình',
        [21, 'success'], // 'Tình cảm',
        [22, 'success'] // 'Tâm lý',
      ])
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
