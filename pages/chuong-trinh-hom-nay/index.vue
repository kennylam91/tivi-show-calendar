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
    <!-- <Tags :tags="tags" /> -->

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COMMON } from '@/assets/utils/constant'
// import { sortByRankDesc } from '@/assets/utils/index'
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
  created() {
    this.$store.dispatch('app/searchProgram',
      {
        limit: 99999,
        page: 1,
        sortBy: 'rank',
        sortDirection: 'DESC',
        startTimeFrom: this.startOfToday(),
        startTimeTo: this.endOfToday()
      })
      .then(res => {
        this.programData = res.content
      })
  },
  methods: {
    async searchProgram(searchForm) {
      this.$store.dispatch('app/setTodayProgramSearchForm', searchForm)
      this.$store.dispatch('app/searchProgram',
        { startTime: searchForm.startTime,
          endTime: searchForm.endTime,
          limit: 99999,
          page: 1,
          sortBy: 'rank',
          sortDirection: 'DESC',
          searchName: searchForm.searchName,
          getCategoryCodes: searchForm.categoryCodes
        })
        .then(res => {
          this.programData = res.content
        })
    },
    handleClearSearch() {
      this.programData = this.todayProgramList
      this.$store.dispatch('app/setTodayProgramSearchForm', null)
    },

    // async fetchScheduleListByTime(startTime, endTime) {
    //   let start, end
    //   const today = new Date()
    //   if (!startTime) {
    //     start = this.convertStringToTimestamp('00:01', today)
    //   } else {
    //     start = this.convertStringToTimestamp(startTime, today)
    //   }
    //   const startTimestamp = start
    //   if (!endTime) {
    //     end = this.convertStringToTimestamp('23:59', today)
    //   } else {
    //     end = this.convertStringToTimestamp(endTime, today)
    //   }
    //   const endTimestamp = end
    //   await this.$store.dispatch('app/searchPrograms',
    //     { startTime: startTimestamp,
    //       endTime: endTimestamp,
    //       limit: 99999,
    //       page: 1,
    //       sortBy: 'rank',
    //       sortDirection: 'DESC' })
    //     .then(res => {
    //       this.searchByDateProgramList = res.content
    //     })
    // },
    getProgramListForContainer() {
      this.movieProgramList = this.programData.filter(this.isMovie)
      this.sciExpProgramList = this.programData.filter(this.isSciExp)
      this.othersProgramList = this.programData.filter(program => {
        return !this.isMovie(program) && !this.isSciExp(program)
      })
    }

  },
  head: {
    title: `Truyền hình 24h - ${COMMON.TODAY_PROGRAM}`,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Tổng hợp đầy đủ, chi tiết các chương trình được phát sóng ngày hôm nay trên các kênh HBO, Cinemax, AXN, Fox Movies, Red By HBO, Discovery, VTV, THVL, TodayTV, ...' }
    ]
  }
}
</script>
<style>

.dialogClass .el-dialog__body {
  padding: 5px;
}
</style>
