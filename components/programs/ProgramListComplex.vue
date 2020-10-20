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
          <div>
            <el-button
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
        </div>
        <el-divider class="my-3" />
        <div>
          <el-tag
            v-for="filter in filters"
            :key="filter.tagName"
            :type="getFilterType(filter.tagName)"
            size="small"
            effect="dark"
            class="mr-1 mb-1"
            closable
            @close="onTagFilterClose(filter)"
          >{{ filter.tagName }}</el-tag>

        </div>
        <div v-if="movieProgramList.length">
          <ProgramListContainer
            :title="COMMON.MOVIE"
            :program-list-prop="movieProgramList"
          />
        </div>

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
      :visible="searchDialogVisible"
      custom-class="dialogClass"
      center
      destroy-on-close
      @close="searchDialogVisible = false"
    >
      <ProgramSearchFormComp
        v-if="searchDialogVisible"
        class="p-3"
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
import { getFilterDesc } from '@/assets/utils'
// import { sortByRankDesc, sortByName } from '@/assets/utils/index'
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
      programList: [],
      isSearching: false,
      filters: []
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

    },
    searchFormProp: {
      immediate: true,
      deep: true,
      handler() {
        if (this.searchFormProp) {
          this.isSearching = this.searchFormProp.categoryCodes.length > 0 || this.searchFormProp.searchName ||
          this.searchFormProp.ranks.length > 0
          this.filters = getFilterDesc(this.searchFormProp)
        } else {
          this.isSearching = false
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
      this.movieProgramList = this.programList.filter(this.isMovie)
      this.sciExpProgramList = this.programList.filter(this.isSciExp)
      this.othersProgramList = this.programList.filter(program => {
        return !this.isMovie(program) && !this.isSciExp(program)
      })
    },
    getFilterType(filter) {
      if (filter.includes('Tên:')) {
        return 'primary'
      } else if (filter.includes('Đánh giá:')) {
        return 'success'
      } else if (filter.includes('Thể loại:')) {
        return 'warning'
      }
    },
    onTagFilterClose(filter) {
      this.$emit('remove-filter-tag', filter)
    }
  }
}
</script>
