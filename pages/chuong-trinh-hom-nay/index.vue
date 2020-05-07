<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ COMMON.TODAY_PROGRAM }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card v-if="todayProgramList" :body-style="{ padding: '0px' }">
      <div slot="header" class="justify-between-align-center">
        <span class="bold large-font-size color-purple">
          {{ COMMON.TODAY_PROGRAM }}</span>
        <el-button
          v-if="!isSearching"
          type="primary"
          size="small"
          plain
          @click="searchDialogVisible = true"
        >{{ COMMON.SEARCH }}</el-button>
        <el-button
          v-if="isSearching"
          type="danger"
          size="small"
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

export default {
  components: { Program, ProgramSearchForm },

  data() {
    return {
      searchDialogVisible: false,
      programData: [],
      isSearching: false,
      dialogKey: 0
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
          this.isSearching = false
        } else {
          this.fetchTodayProgramList()
        }
      }
    }
  },
  created() {
  },
  methods: {
    searchProgram(searchForm) {
      this.isSearching = true
      this.programData = []
      this.programData = this.todayProgramList.filter(program => {
        return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm) &&
        this.filterByRank(program, searchForm)
      })
    },
    handleClearSearch() {
      this.isSearching = false
      this.programData = this.todayProgramList
      this.dialogKey++
    }

  }
}
</script>
<style>

.dialogClass .el-dialog__body {
  padding: 5px;
}
</style>
