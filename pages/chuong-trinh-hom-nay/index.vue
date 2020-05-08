<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ COMMON.TODAY_PROGRAM }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <article>
      <el-card v-if="todayProgramList" shadow="never" :body-style="{ padding: '0px' }">
        <div slot="header" class="justify-between-align-center">
          <h4 class="pageTitle">
            {{ COMMON.TODAY_PROGRAM }}</h4>
          <el-button
            v-if="!isSearching"
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="searchDialogVisible = true"
          >{{ COMMON.SEARCH }}</el-button>
          <el-button
            v-if="isSearching"
            type="danger"
            size="small"
            icon="el-icon-close"
            @click="handleClearSearch"
          >{{ COMMON.CLEAR_SEARCH }}</el-button>
        </div>

        <div class="row" style="margin: 0">
          <div
            v-for="program in programData"
            :key="program.id"
            class="col-sm-4 col-md-3 col-lg-2 col-6 my-2 px-1"
          >
            <Program :program="program" :small="true" />
          </div></div>
      </el-card>
    </article>

    <el-dialog
      :key="dialogKey"
      :visible.sync="searchDialogVisible"
      custom-class="dialogClass"
    >
      <ProgramSearchForm
        :clear="false"
        @search="searchProgram"
        @clear="handleClearSearch"
      />
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Program from '@/components/programs/Program'
import ProgramSearchForm from '@/components/programs/ProgramSearchForm'
import { FB } from '@/assets/utils/constant'

export default {
  components: { Program, ProgramSearchForm },

  data() {
    return {
      searchDialogVisible: false,
      programData: [],
      isSearching: false,
      dialogKey: 0,
      searchByDateProgramList: []
    }
  },
  computed: {
    ...mapGetters({
      todayProgramList: 'fromNowInDayProgramList',
      channelList: 'channelList'
    }),
    vipChannelList() {
      return this.channelList.filter(channel => channel.isVip === true)
    }
  },
  watch: {
    todayProgramList: {
      immediate: true,
      handler() {
        if (this.todayProgramList) {
          this.searchProgram()
        } else {
          this.fetchTodayProgramList()
        }
      }
    }
  },
  created() {
  },
  methods: {
    async searchProgram(searchForm) {
      if (!searchForm) {
        this.programData = this.todayProgramList
        return
      }
      this.isSearching = true
      this.programData = []
      if (searchForm.startTime || searchForm.endTime) {
        await this.fetchScheduleListByTime(searchForm.startTime, searchForm.endTime)
        this.programData = this.todayProgramList.filter(program => {
          return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm) &&
        this.filterByRank(program, searchForm) &&
        this.filterByTime(program)
        })
      } else {
        this.programData = this.todayProgramList.filter(program => {
          return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm) &&
        this.filterByRank(program, searchForm) &&
        this.filterByTime(program)
        })
      }
    },
    handleClearSearch() {
      this.isSearching = false
      this.programData = this.todayProgramList
      this.dialogKey++
    },
    // 09:30
    convertStringToTimestamp(string) {
      if (!string) return null
      const arr = string.trim().split(':')
      const hour = arr[0]
      const min = arr[1]
      const time = new Date()
      time.setHours(hour, min, 0, 0)
      return time
    },
    async fetchScheduleListByTime(startTime, endTime) {
      let start, end
      const list = []
      if (!startTime) {
        start = this.convertStringToTimestamp('00:01')
      } else {
        start = this.convertStringToTimestamp(startTime)
      }
      const startTimestamp = FB.timestamp.fromDate(start)
      if (!endTime) {
        end = this.convertStringToTimestamp('23:59')
      } else {
        end = this.convertStringToTimestamp(endTime)
      }
      const endTimestamp = FB.timestamp.fromDate(end)
      await this.$store.dispatch('app/fetchScheduleList',
        { startTime: startTimestamp,
          endTime: endTimestamp }).then(scheduleList => {
        for (const schedule of scheduleList) {
          if (!list.some(program => program.id === schedule.programId)) {
            const found = this.todayProgramList.find(program =>
              program.id === schedule.programId)
            if (found) {
              list.push(found)
            }
          }
        }
        this.searchByDateProgramList = list
      })
    },
    filterByTime(program) {
      if (this.searchByDateProgramList.length === 0) {
        return true
      } else {
        return this.searchByDateProgramList.some(item => item.id === program.id)
      }
    }

  }
}
</script>
<style>

.dialogClass .el-dialog__body {
  padding: 5px;
}
</style>
