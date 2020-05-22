<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ COMMON.TODAY_PROGRAM }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <ProgramListComplex
      :title="COMMON.TODAY_PROGRAM"
      :program-list-prop="programData"
      :search-form-prop="todayProgramSearchForm"
      :is-searching="isSearching"
      @search="searchProgram"
      @clear="handleClearSearch"
    />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { FB, COMMON } from '@/assets/utils/constant'
import { sortByRankDesc } from '@/assets/utils/index'
import ProgramListComplex from '@/components/programs/ProgramListComplex'

export default {
  components: { ProgramListComplex },
  data() {
    return {
      programData: [],
      dialogKey: 0,
      searchByDateProgramList: [],
      movieProgramList: [],
      sciExpProgramList: [],
      othersProgramList: []
    }
  },
  computed: {
    ...mapGetters({
      todayProgramList: 'fromNowInDayProgramList',
      channelList: 'channelList',
      todayProgramSearchForm: 'todayProgramSearchForm'
    }),
    isSearching() {
      if (this.todayProgramSearchForm) {
        return this.todayProgramSearchForm.categories.length > 0 ||
      this.todayProgramSearchForm.channels.length > 0 ||
      this.todayProgramSearchForm.endTime ||
      this.todayProgramSearchForm.startTime ||
      this.todayProgramSearchForm.name ||
      this.todayProgramSearchForm.ranks.length > 0
      }
      return false
    }
  },
  watch: {
  },
  async created() {
    await this.searchProgram(this.todayProgramSearchForm)
  },
  methods: {
    async searchProgram(searchForm) {
      this.$store.dispatch('app/setTodayProgramSearchForm', searchForm)
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
      this.programData = this.todayProgramList
      this.$store.dispatch('app/setTodayProgramSearchForm', null)
    },

    async fetchScheduleListByTime(startTime, endTime) {
      let start, end
      const list = []
      const today = new Date()
      if (!startTime) {
        start = this.convertStringToTimestamp('00:01', today)
      } else {
        start = this.convertStringToTimestamp(startTime, today)
      }
      const startTimestamp = FB.timestamp.fromDate(start)
      if (!endTime) {
        end = this.convertStringToTimestamp('23:59', today)
      } else {
        end = this.convertStringToTimestamp(endTime, today)
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
    getProgramListForContainer() {
      this.movieProgramList = this.programData.filter(this.isMovie).sort(sortByRankDesc)
      this.sciExpProgramList = this.programData.filter(this.isSciExp).sort(sortByRankDesc)
      this.othersProgramList = this.programData.filter(program => {
        return !this.isMovie(program) && !this.isSciExp(program)
      })
        .sort(sortByRankDesc)
    }

  },
  head: {
    title: `Truyền hình 24h - ${COMMON.TODAY_PROGRAM}`,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Tổng hợp đầy đủ các chương trình được phát sóng hàng ngày trên các kênh HBO, Cinemax, AXN, Fox Movies, Red By HBO, Discovery, ...' }
    ]
  }
}
</script>
<style>

.dialogClass .el-dialog__body {
  padding: 5px;
}
</style>
