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
      <div v-else>{{ program.name }}</div>
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

      <div v-if="live" class="small-font-size mb-1 bold" style="color: #000000b5;">
        <div>{{ COMMON.CHANNEL }}: {{ program.schedule.channelName }}</div>
        <div>{{ COMMON.TIME }}: {{ parseTime(program.schedule.startTime.seconds) }}-{{ parseTime(program.schedule.endTime.seconds) }}</div>
      </div>

      <div v-if="!live">
        <el-tag
          v-for="(item, index) in getCategoryList(program.categories)"
          :key="index"
          size="small"
          effect="dark"
          type="info"
          style="margin: 2px; padding: 0 4px;"
        >
          {{ item | getCategory }}
        </el-tag>
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
  }
}
</script>
