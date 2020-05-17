<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ COMMON.TODAY_PROGRAM }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <article>
      <el-card
        v-if="todayProgramList"
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
          v-if="movieProgramList"
          :title="COMMON.MOVIE"
          :program-list-prop="movieProgramList"
        />
        <ProgramListContainer
          v-if="sciExpProgramList"
          :title="COMMON.SCIENCE_EXPLORE"
          :program-list-prop="sciExpProgramList"
        />
        <ProgramListContainer
          v-if="othersProgramList"
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
// import Program from '@/components/programs/Program'
import ProgramListContainer from '@/components/programs/ProgramListContainer'
import ProgramSearchForm from '@/components/programs/ProgramSearchForm'
import { FB, COMMON } from '@/assets/utils/constant'
import { sortByRankDesc } from '@/assets/utils/index'

export default {
  components: { ProgramSearchForm, ProgramListContainer },
  data() {
    return {
      searchDialogVisible: false,
      programData: [],
      isSearching: false,
      dialogKey: 0,
      searchByDateProgramList: [],
      movieProgramList: null,
      sciExpProgramList: null,
      othersProgramList: null
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
    // movieProgramList() {
    //   return this.programData.filter(this.isMovie).sort(sortByRankDesc)
    // },
    // sciExpProgramList() {
    //   return this.programData.filter(this.isSciExp).sort(sortByRankDesc)
    // },
    // othersProgramList() {
    //   return this.programData.filter(program => {
    //     return !this.isMovie(program) && !this.isSciExp(program)
    //   }).sort(sortByRankDesc)
    // }
  },
  watch: {
    // todayProgramList: {
    //   immediate: true,
    //   handler() {
    //     if (this.todayProgramList) {
    //       this.searchProgram()
    //     } else {
    //       this.fetchTodayProgramList()
    //     }
    //   }
    // }
  },
  async created() {
    await this.searchProgram()
  },
  methods: {
    async searchProgram(searchForm) {
      if (!searchForm) {
        this.programData = this.todayProgramList
        this.getProgramListForContainer()
        return
      }
      this.isSearching = true
      this.programData = []
      debugger
      if (searchForm.startTime || searchForm.endTime) {
        await this.fetchScheduleListByTime(searchForm.startTime, searchForm.endTime)
        this.programData = this.todayProgramList.filter(program => {
          return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm) &&
        this.filterByRank(program, searchForm) &&
        this.filterByTime(program)
        })
        this.getProgramListForContainer()
      } else {
        this.programData = this.todayProgramList.filter(program => {
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
