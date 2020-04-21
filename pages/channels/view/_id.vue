<template>
  <div v-if="channel">
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ channel.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="p-1">
      <div slot="header">
        <div class="bold">{{ channel.name }}</div>
      </div>
      <el-table :data="scheduleList" border stripe style="width: 100%" size="small">
        <el-table-column
          label="Start Time"
          width="120"
          align="center"
        >
          <template slot-scope="{row}">
            <div>{{ parseVNTime(row.startTime.seconds) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="Program"
        >
          <template slot-scope="{row}">
            <el-link :underline="false" @click="moveToProgramDetail(row.programId)">{{ row.programName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="Category"
        >
          <template slot-scope="{row}">
            <div>{{ row.category | getCategory }}</div>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

  </div>
</template>
<script>
import { firebase } from '@/FireBase'
import { constantMixin } from '@/utils/constant'
import { parseVNTime } from '@/utils/index'
import { getCategory } from '@/utils/index'

export default {
  components: { },
  filters: { getCategory },
  mixins: [constantMixin],
  data() {
    return {
      channelId: null,
      channel: null,
      channelRef: firebase.firestore().collection('channels'),
      scheduleRef: firebase.firestore().collection('schedules'),
      programRef: firebase.firestore().collection('programs'),
      scheduleList: []
    }
  },
  created() {
    this.channelId = this.$route.params.id
    this.$store.dispatch('channel/fetchChannel', { channelId: this.channelId }).then(channel => {
      this.channel = channel
    })
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const startTimestamp = firebase.firestore.Timestamp.fromDate(start)

    const end = new Date()
    end.setHours(23, 59, 59, 999)
    const endTimestamp = firebase.firestore.Timestamp.fromDate(end)

    this.$store.dispatch('channel/fetchScheduleList',
      { channelId: this.channelId, startTime: startTimestamp, endTime: endTimestamp }).then(scheduleList => {
      this.scheduleList = scheduleList
    })

    console.log(this.channelId)
  },
  methods: {
    parseVNTime(time) {
      return parseVNTime(time, '{h}:{i} {a}', true, true)
    }
  }
}
</script>
