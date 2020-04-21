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
      <div class="p-1 justify-between-align-center">
        <div class="inline-block">
          <span class="mr-1">{{ COMMON.DATE | uppercaseFirst }}: </span>
          <el-date-picker
            v-model="selectedDate"
            format="dd/MM/yyyy"
            size="small"
            type="date"
          />
        </div>
        <div class="inline-block">
          <el-input
            v-model="searchText"
            :placeholder="COMMON.SEARCH"
            size="small"
            clearable
            style="width: 500px;"
            @change="searchProgram"
          />
        </div>

      </div>
      <el-table
        :data="scheduleData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          :label="COMMON.START_TIME"
          width="150"
          align="center"
        >
          <template slot-scope="{row}">
            <div>{{ parseVNTime(row.startTime.seconds) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="COMMON.PROGRAM_NAME"
        >
          <template slot-scope="{row}">
            <el-link :underline="false" @click="viewProgramDetail(row.programId)">{{ row.programName }}</el-link>
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

    <el-dialog
      v-if="detailProgramDlgVisible"
      :title="program.name"
      :visible.sync="detailProgramDlgVisible"
      width="50%"
    >
      <div v-if="program">
        <p class="mb-2">{{ COMMON.CATEGORY }}: {{ program.category|getCategory }}</p>
        <p>{{ COMMON.DESCRIPTION }}: {{ program.discription }}</p>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="handleCloseDialog">{{ COMMON.CLOSE }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { firebase } from '@/FireBase'
import { constantMixin } from '@/utils/constant'
import { parseVNTime, getCategory } from '@/utils/index'
import { uppercaseFirst } from '@/filters/index'

export default {
  components: { },
  filters: { getCategory, uppercaseFirst },
  mixins: [constantMixin],
  data() {
    return {
      channelId: null,
      channel: null,
      channelRef: firebase.firestore().collection('channels'),
      scheduleRef: firebase.firestore().collection('schedules'),
      programRef: firebase.firestore().collection('programs'),
      scheduleList: [],
      program: null,
      detailProgramDlgVisible: false,
      selectedDate: new Date(),
      searchText: '',
      scheduleData: []
    }
  },
  watch: {
    selectedDate() {
      this.getScheduleList()
    }
  },
  created() {
    this.channelId = this.$route.params.id
    this.$store.dispatch('app/fetchChannel', { channelId: this.channelId }).then(channel => {
      this.channel = channel
    })
    this.getScheduleList()
  },
  methods: {
    parseVNTime(time) {
      return parseVNTime(time, '{h}:{i} {a}', true, true)
    },
    viewProgramDetail(programId) {
      console.log('viewProgramDetail')
      this.$store.dispatch('app/fetchProgram', { programId }).then(program => {
        this.program = program
        this.detailProgramDlgVisible = true
      })
    },
    getScheduleList() {
      const start = this.selectedDate
      start.setHours(0, 0, 0, 0)
      const startTimestamp = firebase.firestore.Timestamp.fromDate(start)

      const end = this.selectedDate
      end.setHours(23, 59, 59, 999)
      const endTimestamp = firebase.firestore.Timestamp.fromDate(end)

      this.$store.dispatch('app/fetchScheduleList',
        { channelId: this.channelId, startTime: startTimestamp, endTime: endTimestamp }).then(scheduleList => {
        this.scheduleList = scheduleList
        this.searchText = ''
        this.scheduleData = this.scheduleList
      })
    },
    searchProgram() {
      this.scheduleData = this.searchText
        ? this.scheduleList.filter(schedule => schedule.programName.toLowerCase().includes(this.searchText.toLowerCase()))
        : this.scheduleList
    }
  }
}
</script>
