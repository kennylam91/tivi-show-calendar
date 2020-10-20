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
      @search="searchProgram"
      @clear="handleClearSearch"
      @remove-filter-tag="onFilterTagRemove"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { COMMON } from '@/assets/utils/constant'
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
    }
  },
  watch: {

  },
  created() {
    if (!this.nextDaysProgramList) {
      this.$store.dispatch('app/fetchTomorrowPrograms',
        {
          limit: 99999,
          page: 1,
          startTimeFrom: this.endOfToday(),
          startTimeTo: this.endOfToday() + 24 * 60 * 60 * 1000
        })
        .then(res => {
          this.$store.dispatch('app/setNextDaysProgramList', res)
          this.searchProgram(this.nextDaysProgramSearchForm)
        })
    } else {
      this.programData = [...this.nextDaysProgramList]
      this.searchProgram(this.nextDaysProgramSearchForm)
    }
  },
  methods: {
    async searchProgram(searchForm) {
      this.$store.dispatch('app/setNextDaysProgramSearchForm', searchForm)
      this.programData = this.nextDaysProgramList.filter(item => {
        return filterByRank(item, searchForm) && filterByName(item, searchForm) && filterByCategory(item, searchForm)
      })
    },
    handleClearSearch() {
      this.programData = [...this.nextDaysProgramList]
      this.$store.dispatch('app/setNextDaysProgramSearchForm', new ProgramSearchForm())
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
        newForm = { ...this.nextDaysProgramSearchForm, searchName: '' }
      } else if (filter.field === 'ranks') {
        newForm = { ...this.nextDaysProgramSearchForm,
          ranks: this.nextDaysProgramSearchForm.ranks.filter(r => r !== filter.fieldValue) }
      } else if (filter.field === 'categoryCodes') {
        newForm = { ...this.nextDaysProgramSearchForm,
          categoryCodes: this.nextDaysProgramSearchForm.categoryCodes.filter(c => c !== filter.fieldValue) }
      }

      this.$store.dispatch('app/setNextDaysProgramSearchForm', newForm)
      this.searchProgram(this.nextDaysProgramSearchForm)
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
