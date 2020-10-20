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
      @search="searchProgram"
      @clear="handleClearSearch"
      @remove-filter-tag="onFilterTagRemove"
    />
    <!-- <Tags :tags="tags" /> -->

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COMMON } from '@/assets/utils/constant'
// import { sortByRankDesc } from '@/assets/utils/index'
import ProgramListComplex from '@/components/programs/ProgramListComplex'
import { filterByName, filterByRank, filterByCategory } from '@/assets/utils/index'
import { ProgramSearchForm } from '@/assets/utils/index'

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
    })

  },
  watch: {
  },
  created() {
    if (!this.todayProgramList) {
      this.$store.dispatch('app/fetchTodayPrograms',
        {
          limit: 99999,
          page: 1,
          startTimeFrom: new Date(),
          startTimeTo: this.endOfToday()
        })
        .then(res => {
          this.$store.dispatch('app/setFromNowInDayProgramList', res)
          this.searchProgram(this.todayProgramSearchForm)
        })
    } else {
      this.searchProgram(this.todayProgramSearchForm)
    }
  },
  methods: {
    searchProgram(searchForm) {
      this.$store.dispatch('app/setTodayProgramSearchForm', searchForm)
      this.programData = this.todayProgramList.filter(item => {
        return filterByRank(item, searchForm) && filterByName(item, searchForm) && filterByCategory(item, searchForm)
      })
    },
    handleClearSearch() {
      this.programData = this.todayProgramList
      this.$store.dispatch('app/setTodayProgramSearchForm', new ProgramSearchForm())
    },
    getProgramListForContainer() {
      this.movieProgramList = this.programData.filter(this.isMovie)
      this.sciExpProgramList = this.programData.filter(this.isSciExp)
      this.othersProgramList = this.programData.filter(program => {
        return !this.isMovie(program) && !this.isSciExp(program)
      })
    },
    onFilterTagRemove(filter) {
      let newForm
      if (filter.field === 'searchName') {
        newForm = { ...this.todayProgramSearchForm, searchName: '' }
      } else if (filter.field === 'ranks') {
        newForm = { ...this.todayProgramSearchForm,
          ranks: this.todayProgramSearchForm.ranks.filter(r => r !== filter.fieldValue) }
      } else if (filter.field === 'categoryCodes') {
        newForm = { ...this.todayProgramSearchForm,
          categoryCodes: this.todayProgramSearchForm.categoryCodes.filter(c => c !== filter.fieldValue) }
      }

      this.$store.dispatch('app/setTodayProgramSearchForm', newForm)
      this.searchProgram(this.todayProgramSearchForm)
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
