<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ COMMON.TODAY_PROGRAM }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-dialog
      :visible.sync="searchDialogVisible"
      custom-class="dialogClass"
    >
      <ProgramSearchForm @search="searchProgram" @clear="handleClear" />

    </el-dialog>

    <el-card v-if="todayProgramList" :body-style="{ padding: '0px' }">
      <div slot="header" class="justify-between-align-center">
        <span class="bold color-primary">{{ COMMON.TODAY_PROGRAM }}</span>
        <el-button
          type="primary"
          size="small"
          plain
          @click="searchDialogVisible = true"
        >Search</el-button>

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
      programData: []
    }
  },
  computed: {
    ...mapGetters({
      todayProgramList: 'fromNowInDayProgramList',
      channelList: 'channelList'
    }),
    isSearching() {
      return this.programSearchForm.name || this.programSearchForm.channels.length > 0 ||
      this.programSearchForm.categories.length > 0
    },
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
    searchProgram(searchForm) {
      this.programData = []
      this.programData = this.todayProgramList.filter(program => {
        return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm)
      })
    },
    handleClear() {
      this.programData = this.todayProgramList
    }

  }
}
</script>
<style>

.dialogClass .el-dialog__body {
  padding: 5px;
}
</style>
