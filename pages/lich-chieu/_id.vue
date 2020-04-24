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
          <img class="mr-2" :src="channel.logo" height="60">
          <p class="small-font-size">{{ channel.description }}</p>
        </div>
        <div class="row">
          <div class="my-2 col-xs-12 col-sm-8 col-md-6">
            <span class="">{{ COMMON.DATE | uppercaseFirst }}: </span>
            <el-date-picker
              v-model="selectedDate"
              format="dd/MM/yyyy"
              size="small"
              type="date"
            />
          </div>
          <div class="my-2 col-xs-12 col-sm-4 col-md-6">
            <el-input
              v-model="searchText"
              :placeholder="COMMON.SEARCH"
              size="small"
              clearable
              @change="searchProgram"
            />
          </div>
        </div>

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
              <el-tag v-for="(item, index) in row.categories" :key="index" size="small" effect="dark" type="info" style="margin: 2px;">
                {{ item | getCategory }}
              </el-tag>
            </template>
          </el-table-column>

        </el-table>
      </div></el-card>

  </div>
</template>
<script>
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
    this.channelId = this.$route.params.id.split('-').pop()
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

