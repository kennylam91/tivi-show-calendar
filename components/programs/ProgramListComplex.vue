<template>
  <div>
    <article>
      <el-card
        v-loading="loading"
        shadow="never"
        :body-style="{ padding: '16px' }"
      >
        <div class="justify-between-align-center mb-2">
          <h4 class="pageTitle" v-text="title" />
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
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProgramListContainer from '@/components/programs/ProgramListContainer'
import ProgramSearchFormComp from '@/components/programs/ProgramSearchForm'
import { sortByRankDesc } from '@/assets/utils/index'
export default {
  components: { ProgramSearchFormComp, ProgramListContainer },
  props: {
    programListProp: {
      required: true,
      type: Array
    },
    searchFormProp: {
      required: false,
      type: Object,
      default: () => null
    },
    title: {
      required: true,
      type: String
    },
    isSearching: {
      required: false,
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      searchDialogVisible: false,
      programData: [],
      dialogKey: 0,
      searchByDateProgramList: [],
      movieProgramList: [],
      sciExpProgramList: [],
      othersProgramList: [],
      programList: []
      // searchFormData: null
    }
  },
  computed: {
    ...mapGetters({
      loading: 'loading'
    })
  },
  watch: {
    programListProp: {
      immediate: true,
      deep: true,
      handler() {
        if (this.programListProp) {
          this.programList = [...this.programListProp]
          this.getProgramListForContainer()
        }
      }

    }
  },

  methods: {
    searchProgram(searchForm) {
      this.$emit('search', searchForm)
    },
    handleClearSearch() {
      this.dialogKey++
      this.$emit('clear')
    },
    getProgramListForContainer() {
      this.movieProgramList = this.programList.filter(this.isMovie).sort(sortByRankDesc)
      this.sciExpProgramList = this.programList.filter(this.isSciExp).sort(sortByRankDesc)
      this.othersProgramList = this.programList.filter(program => {
        return !this.isMovie(program) && !this.isSciExp(program)
      })
        .sort(sortByRankDesc)
    }
  }
}
</script>
