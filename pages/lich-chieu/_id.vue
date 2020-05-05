<template>
  <div v-if="channel">
    <div class="py-4 px-2">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/danh-sach-kenh' }">{{ COMMON.CHANNEL_LIST }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ channel.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card :body-style="{ padding: '10px' }">
      <div class="row">
        <div
          class="col-sm-4 col-md-2 text-center mb-2"
          style="padding-left: 15px;padding-right: 15px; "
        >
          <img class="img-fluid" :src="channel.logo" :alt="channel.name">
        </div>
        <div
          class="col-sm-8 col-md-10 flex"
          style="padding-left: 15px;padding-right: 15px; align-items: center "
        >
          <p class="small-font-size">{{ channel.description }}</p>
        </div>
      </div>
      <div class="row">
        <div
          class="my-2 col-6 col-sm-6 col-md-4"
          style="padding-right: 5px; padding-left: 15px;"
        >
          <el-date-picker
            v-model="selectedDate"
            format="dd/MM/yyyy"
            size="small"
            type="date"
            class="w-100"
          />
        </div>
        <div
          class="my-2 col-6 col-sm-4 offset-md-4 col-md-4"
          style="padding-right: 15px; padding-left: 5px;"
        >
          <el-input
            v-model="searchText"
            :placeholder="COMMON.SEARCH"
            size="small"
            clearable
            @change="searchProgram"
          />
        </div>
      </div>

      <table class="table table-hover small-font-size table-sm">
        <thead>
          <tr class="color-info ">
            <th scope="col">Time</th>
            <th scope="col">{{ COMMON.PROGRAM_NAME }}</th>
            <th>{{ COMMON.CATEGORY }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in scheduleData" :key="index" :class="{scheduleInShowing : isShowing(row)}">
            <td>
              <div>{{ parseTime(row.startTime.seconds) }}</div>
            </td>
            <td>
              <el-link :underline="false" @click="viewProgramDetail(row)">
                <span class="color-primary small-font-size">{{ row.programName | uppercaseAll }}</span>
              </el-link>
            </td>
            <td>
              <el-tag
                v-for="item in row.categories.filter(item => item !== 1)"
                :key="item"
                size="small"
                effect="dark"
                type="info"
                style="margin: 2px;"
              >
                {{ item | getCategory }}
              </el-tag>
            </td>
          </tr>
        </tbody>
      </table>
    </el-card>

  </div>
</template>
<script>
import { parseVNTime } from '@/assets/utils/index'
import { mapGetters } from 'vuex'
import { FB } from '@/assets/utils/constant'

export default {
  components: { },
  layout: 'vuetify-layout',
  asyncData({ params, store }) {
    const channelId = params.id.split('_').pop()
    let scheduleData
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const startTimestamp = FB.timestamp.fromDate(start)

    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const endTimestamp = FB.timestamp.fromDate(end)

    const promise0 = store.dispatch('app/fetchScheduleList',
      { channelId: channelId,
        startTime: startTimestamp,
        endTime: endTimestamp })

    const channel = store.state.app.channelList.find(item => item.id === channelId)
    return promise0.then(list => {
      scheduleData = list
      return { channel, scheduleData, channelId }
    })
  },
  data() {
    return {
      channelId: null,
      scheduleList: [],
      program: null,
      detailProgramDlgVisible: false,
      selectedDate: new Date(),
      searchText: '',
      scheduleData: [],
      channel: null
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList'
    })
  },
  watch: {
    selectedDate() {
      this.getScheduleList()
    }
  },
  created() {
    const dateParam = this.$route.query.date || new Date()
    if (dateParam) {
      this.selectedDate = dateParam
    }
  },
  methods: {
    parseTime(time) {
      return parseVNTime(time, '{H}:{i} ', true, true)
    },
    getScheduleList() {
      this.fetchScheduleList(this.channelId, this.selectedDate).then(scheduleList => {
        this.scheduleList = scheduleList
        this.searchText = ''
        this.scheduleData = this.scheduleList
      })
    },
    searchProgram() {
      this.scheduleData = this.searchText
        ? this.scheduleList.filter(schedule => schedule.programName.toLowerCase().includes(this.searchText.toLowerCase()))
        : this.scheduleList
    },
    isShowing(schedule) {
      const now = new Date()
      return (schedule.startTime.seconds * 1000 <= Date.parse(now) &&
      schedule.endTime.seconds * 1000 >= Date.parse(now))
    }
  }
}
</script>
<style>
#scheduleTable .cell {
  word-break: break-word;
}

</style>

