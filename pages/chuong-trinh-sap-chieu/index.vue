<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ COMMON.NEXT_DAY_PROGRAM }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <ProgramListComplex
      :title="COMMON.NEXT_DAY_PROGRAM"
      :program-list-prop="programData"
      :search-form-prop="nextDaysProgramSearchForm"
      :is-searching="isSearching"
      @search="searchProgram"
      @clear="handleClearSearch"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COMMON } from '@/assets/utils/constant'
import ProgramListComplex from '@/components/programs/ProgramListComplex'

export default {
  components: { ProgramListComplex },
  data() {
    return {
      programData: [],
      dialogKey: 0,
      searchByDateProgramList: [],
      movieProgramList: null,
      sciExpProgramList: null,
      othersProgramList: null
    }
  },
  computed: {
    ...mapGetters({
      nextDaysProgramList: 'nextDaysProgramList',
      channelList: 'channelList',
      nextDaysProgramSearchForm: 'nextDaysProgramSearchForm'
    }),
    vipChannelList() {
      return this.channelList.filter(channel => channel.vip === true)
    },
    isSearching() {
      if (this.nextDaysProgramSearchForm) {
        return this.nextDaysProgramSearchForm.categories.length > 0 ||
      this.nextDaysProgramSearchForm.channels.length > 0 ||
      this.nextDaysProgramSearchForm.endTime ||
      this.nextDaysProgramSearchForm.startTime ||
      this.nextDaysProgramSearchForm.name ||
      this.nextDaysProgramSearchForm.ranks.length > 0
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
        startTimeFrom: this.endOfToday(),
        startTimeTo: this.endOfToday() + 24 * 60 * 60 * 1000
      })
      .then(res => {
        this.programData = res.content
      })
  },
  methods: {
    async searchProgram(searchForm) {
      this.$store.dispatch('app/setNextDaysProgramSearchForm', searchForm)
      if (!searchForm) {
        this.programData = this.nextDaysProgramList
        return
      }
      this.isSearching = true
      this.programData = []
      if (searchForm.startTime || searchForm.endTime) {
        await this.fetchScheduleListByTime(searchForm.startTime, searchForm.endTime)
        this.programData = this.nextDaysProgramList.filter(program => {
          return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm) &&
        this.filterByRank(program, searchForm) &&
        this.filterByTime(program)
        })
      } else {
        this.programData = this.nextDaysProgramList.filter(program => {
          return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm) &&
        this.filterByRank(program, searchForm) &&
        this.filterByTime(program)
        })
      }
    },
    handleClearSearch() {
      this.programData = [...this.nextDaysProgramList]
      this.$store.dispatch('app/setNextDaysProgramSearchForm', null)
    },
    getProgramListForContainer() {
      this.movieProgramList = this.programData.filter(this.isMovie)
      this.sciExpProgramList = this.programData.filter(this.isSciExp)
      this.othersProgramList = this.programData.filter(program => {
        return !this.isMovie(program) && !this.isSciExp(program)
      })
    }
  },
  head: {
    title: `Truyền hình 24h - ${COMMON.NEXT_DAY_PROGRAM}`,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Tổng hợp đầy đủ, chi tiết các chương trình được phát sóng ngày mai trên các kênh HBO, Cinemax, AXN, Fox Movies, Red By HBO, Discovery, VTV, THVL, TodayTV, ...' }
    ]
  }

}
</script>
