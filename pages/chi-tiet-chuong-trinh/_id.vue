<template>
  <div v-if="program">
    <div class="py-4 w-100">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item class="shorten-text" style="max-width: 70%;">
          <span>{{ program.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <div>
        <div class="row mb-4">
          <div class="col-sm-4 col-md-3 text-center">
            <img class="img-fluid mb-2 " :src="program.logo" :alt="program.name">
          </div>
          <div class="col-sm-8 col-md-9">
            <div class="color-purple bold mb-2">{{ program.name }}</div>
            <div class="small-font-size">
              <span>{{ COMMON.CATEGORY }}: </span>
              <el-tag
                v-for="(item, index) in program.categories"
                :key="index"
                size="small"
                effect="dark"
                :type="categoryTagMap.get(item)"
                style="margin: 2px;"
              >
                {{ item | getCategory }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <el-divider />
      <div class="my-2">
        <h5 class="color-primary">{{ COMMON.PROGRAM_SCHEDULE_NEXT_DAYS }}</h5>
        <table v-if="scheduleList.length > 0" class="table table-hover small-font-size">
          <tr class="color-info bold">
            <th>{{ COMMON.CHANNEL }}</th>
            <th>{{ COMMON.START }}</th>
            <th>{{ COMMON.END }}</th>
          </tr>
          <tbody>
            <tr v-for="row in scheduleList" :key="row.id">
              <td>
                <el-link @click="viewChannelDetail({id: row.channelId, name: row.channelName})">
                  <span class="color-purple">{{ row.channelName }}</span>
                </el-link>
              </td>
              <td>
                {{ row.startTime.seconds | parseTime }}
              </td>
              <td>
                {{ row.endTime.seconds | parseTime }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="ml-4 color-info">{{ COMMON.NO_DATA }}</p>
      </div>
      <el-divider />

      <div>
        <h5 class="color-primary">{{ COMMON.INTRODUCTION }}</h5>
        <p class="small-font-size">{{ program.description }}</p>
      </div>

    </el-card>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { parseVNTime } from '@/assets/utils/index'
import { FB } from '@/assets/utils/constant'
import { categoryTagMap } from '@/assets/utils/constant'

export default {
  filters: {
    parseTime(time) {
      return parseVNTime(time, '{d}/{m}/{y} {H}:{i}', true, true)
    }
  },
  asyncData({ store, params }) {
    const now = new Date()
    const before30Mins = Date.parse(now) - 30 * 60 * 1000
    const programId = params.id.split('_').pop().trim()

    const schedulePromise = FB.scheduleRef.where('programId', '==', programId)
      .where('startTime', '>=', FB.timestamp.fromMillis(before30Mins))
      .orderBy('startTime', 'asc').get()
    const programPromise = store.dispatch('app/fetchProgram', { programId })
    return Promise.all([schedulePromise, programPromise]).then(results => {
      const scheduleListDoc = results[0]
      const scheduleList = []
      const program = results[1]
      scheduleListDoc.forEach(doc => {
        const schedule = { ...doc.data(), id: doc.id }
        scheduleList.push(schedule)
      })
      return { scheduleList, program }
    })
  },
  data() {
    return {
      program: null,
      programId: null,
      scheduleList: null,
      categoryTagMap
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      todayProgramList: 'todayProgramList',
      nextDaysProgramList: 'nextDaysProgramList'
    })
  },
  watch: {
  },
  created() {
  },
  methods: {
    fetchScheduleList() {
      const now = new Date()
      this.$store.dispatch('app/fetchScheduleList',
        { programId: this.programId, startTime: now, orderBy: ['startTime', 'asc'] }).then(list => {
        list.forEach(schedule => {
          schedule.channel = this.channelList.find(item => item.id === schedule.channelId)
        })
        this.scheduleList = list
      })
    }
  }
}
</script>
