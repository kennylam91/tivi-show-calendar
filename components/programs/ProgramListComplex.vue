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
        :data-prop="todayProgramSearchForm"
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
    }
  },
  watch: {
    programListProp() {
      this.programList = [...this.programListProp]
    }
  }
}
</script>
