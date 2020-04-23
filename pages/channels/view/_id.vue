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
        <div class="mb-2 flex" style="">
          <img class="mr-2" :src="channel.logo" height="50">
          <p class="small-font-size">{{ channel.description }}</p>
        </div>
        <el-row>
          <el-col :xs="24" :sm="10" :md="8" class="mb-2">
            <span class="">{{ COMMON.DATE | uppercaseFirst }}: </span>
            <el-date-picker
              v-model="selectedDate"
              format="dd/MM/yyyy"
              size="small"
              type="date"
              class="w-100"
            />
          </el-col>
          <el-col :span="16" :sm="14" :xs="24">
            <el-input
              v-model="searchText"
              :placeholder="COMMON.SEARCH"
              size="small"
              clearable
              class="w-100 mb-2"
              @change="searchProgram"
            />
          </el-col>
        </el-row>

        <el-table
          id="scheduleTable"
          :data="scheduleData"
          border
          stripe
          fit
          style="width: 100%"
        >
          <el-table-column
            :label="COMMON.TIME"
            align="center"
            :min-width="25"
          >
            <template slot-scope="{row}">
              <div>{{ parseTime(row.startTime.seconds) }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="COMMON.PROGRAM_NAME"
            :min-width="50"
          >
            <template slot-scope="{row}">
              <el-link :underline="false" @click="viewProgramDetail(row.programId)">
                <span class="color-primary">{{ row.programName }}</span>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column
            :label="COMMON.CATEGORY"
            :min-width="25"
          >
            <template slot-scope="{row}">
              <div>{{ row.category | getCategory }}</div>
            </template>
          </el-table-column>

        </el-table>
      </div></el-card>

    <!-- <el-dialog
      v-if="detailProgramDlgVisible"
      :title="COMMON.PROGRAM_DETAIL"
      :visible.sync="detailProgramDlgVisible"
      width="70%"
    >
      <div v-if="program">
        <div class="flex" style="justify-content: space-between">
          <div>
            <p class="mb-2">{{ COMMON.PROGRAM_NAME }}: {{ program.name }}</p>
            <p class="mb-2">{{ COMMON.CATEGORY }}: {{ program.category|getCategory }}</p>
            <p>{{ COMMON.DESCRIPTION }}: {{ program.discription }}</p>
          </div>
          <div>
            <img width="150" :src="program.logo" alt="logo">
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" size="small" @click="detailProgramDlgVisible= false">{{ COMMON.CLOSE }}</el-button>
      </span>
    </el-dialog> -->

  </div>
</template>
<script>
// import { firebase } from '@/FireBase'
import { parseVNTime } from '@/assets/utils/index'

export default {
  components: { },
  data() {
    return {
      channelId: null,
      channel: null,
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
    parseTime(time) {
      return parseVNTime(time, '{h}:{i} {a}', true, true)
    },
    viewProgramDetail(programId) {
      console.log('viewProgramDetail')
      // this.$store.dispatch('app/fetchProgram', { programId }).then(program => {
      //   this.program = program
      //   this.detailProgramDlgVisible = true
      // })
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
    }
  }
}
</script>
<style>
#scheduleTable .cell {
  word-break: break-word;
}
</style>

