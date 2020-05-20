<template>
  <div>
    <article>
      <el-card
        v-if="programList.length > 0"
        shadow="never"
        :body-style="{ padding: '16px' }"
      >
        <div class="justify-between-align-center mb-2">
          <h4 class="pageTitle">{{ COMMON.TODAY_PROGRAM }}</h4>
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
        <el-divider />

        <ProgramListContainer
          v-if="movieProgramList.length"
          :title="COMMON.MOVIE"
          :program-list-prop="movieProgramList"
        />
        <ProgramListContainer
          v-if="sciExpProgramList.length"
          :title="COMMON.SCIENCE_EXPLORE"
          :program-list-prop="sciExpProgramList"
        />
        <ProgramListContainer
          v-if="othersProgramList.length"
          :title="COMMON.INFO_ENTERTAINMENT"
          :program-list-prop="othersProgramList"
        />
      </el-card>
    </article>
    <el-dialog
      :key="dialogKey"
      :visible.sync="searchDialogVisible"
      custom-class="dialogClass"
    >
      <ProgramSearchFormComp
        :clear="false"
        :data-prop="searchFormProp"
        @search="searchProgram"
        @clear="handleClearSearch"
      />
    </el-dialog>
  </div>
</template>

<script>
import ProgramListContainer from '@/components/programs/ProgramListContainer'
import ProgramSearchFormComp from '@/components/programs/ProgramSearchForm'
import { FB, COMMON } from '@/assets/utils/constant'
import { sortByRankDesc } from '@/assets/utils/index'
import { ProgramSearchForm } from '@/assets/model/ProgramSearchForm'
export default {
  components: { ProgramSearchFormComp, ProgramListContainer },
  props: {
    programListProp: {
      required: true,
      type: Array
    },
    searchFormProp: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      searchDialogVisible: false,
      programData: [],
      isSearching: false,
      dialogKey: 0,
      searchByDateProgramList: [],
      movieProgramList: [],
      sciExpProgramList: [],
      othersProgramList: [],
      programList: []
      // searchFormData: null
    }
  },
  watch: {
    programListProp() {
      this.programList = [...this.programListProp]
    }
    // searchFormProp() {
    //   this.searchFormData = { ...this.searchFormProp }
    // }
  },
  async created() {
    await this.searchProgram(this.searchFormProp)
  },
  methods: {
    async searchProgram(searchForm) {
      this.$store.dispatch('app/setTodayProgramSearchForm', searchForm)
      if (!searchForm) {
        this.programData = this.programList
        this.getProgramListForContainer()
        return
      }
      this.isSearching = true
      this.programData = []
      if (searchForm.startTime || searchForm.endTime) {
        await this.fetchScheduleListByTime(searchForm.startTime, searchForm.endTime)
        this.programData = this.programList.filter(program => {
          return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm) &&
        this.filterByRank(program, searchForm) &&
        this.filterByTime(program)
        })
        this.getProgramListForContainer()
      } else {
        this.programData = this.programList.filter(program => {
          return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm) &&
        this.filterByRank(program, searchForm) &&
        this.filterByTime(program)
        })
        this.getProgramListForContainer()
      }
    },
    handleClearSearch() {
      this.isSearching = false
      this.programData = this.todayProgramList
      this.getProgramListForContainer()
      this.$store.dispatch('app/setTodayProgramSearchForm', null)

      this.dialogKey++
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
  }
}
</script>
