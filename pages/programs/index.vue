<template>
  <div>
    <el-card shadow="never" :body-style="{ padding: '5px' }">
      <div slot="header" class="justify-between-align-center">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">Dashboard</el-breadcrumb-item>
          <el-breadcrumb-item>Program List</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button
          type="primary"
          size="small"
          plain
          @click="$router.push({ path: '/programs/create' })"
        >Create Program</el-button>
      </div>

      <ProgramSearchFormComp
        :data-prop="programSearchQuery"
        :is-show-search-by-time="false"
        :clear="true"
        :is-admin="true"
        @search="fetchProgramList"
        @clear="handleClear"
      />
      <el-button
        v-if="selectedPrograms.length > 0"
        type="danger"
        size="mini"
        class="mb-2"
        @click="handleProgramDeleteClick"
      >Delete</el-button>
      <el-table
        id="programTable"
        v-loading="loading"
        :data="tableData"
        border
        stripe
        size="small"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="60"
        />
        <el-table-column
          :label="COMMON.PROGRAM_NAME"
          min-width="38"
        >
          <template slot-scope="{row}">
            {{ row.name }} - {{ row.enName }}
          </template>
        </el-table-column>
        <el-table-column
          :label="COMMON.RANK"
          align="center"
          min-width="10"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.rank" size="small" effect="dark" :type="getRankTagType(row.rank)">
              {{ row.rank | getRankLabel }}
            </el-tag>

          </template>
        </el-table-column>
        <el-table-column
          :label="COMMON.CATEGORY"
          min-width="32"
        >
          <template slot-scope="{row}">
            <div v-if="row.categories">
              <el-tag
                v-for="(item, index) in row.categories"
                :key="index"
                class="m-1"
                effect="dark"
                type="info"
                size="small"
              >{{ item.name }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="COMMON.ACTION"
          min-width="10"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleProgramEditClick(scope.row)"
            >Edit</el-button>

          </template>
        </el-table-column>

      </el-table>
      <div>
        <el-pagination
          :current-page.sync="page"
          :page-sizes="[10, 20, 50]"
          :page-size.sync="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems"
          @size-change="onPaginationChange"
          @current-change="onPaginationChange"
        />
      </div>

    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { programRankMap, programRankOptions } from '@/assets/utils/constant'
import ProgramSearchFormComp from '@/components/programs/ProgramSearchForm'
import paginationMixin from '@/components/mixins/pagination-mixin'
import { ProgramSearchForm } from '@/assets/utils/index'

export default {
  middleware: 'auth',
  components: { ProgramSearchFormComp },
  filters: {
    getRankLabel(value) {
      if (value) {
        return programRankMap.get(value)
      }
      return ''
    }

  },
  mixins: [paginationMixin],
  data() {
    return {
      tableData: null,
      totalItems: 0,
      programListData: [],
      programList: null,
      programTableKey: 0,
      programRankOptions,
      loading: false,
      selectedPrograms: []
    }
  },
  computed: {
    ...mapGetters({
      programSearchQuery: 'programSearchQuery',
      fromTodayProgramList: 'fromTodayProgramList'
    })
  },
  watch: {
  },
  created() {
    // this.listQuery.name = this.$route.query.q
    this.fetchProgramList()
  },
  methods: {
    getRankTagType(value) {
      const map = new Map([
        [3, 'danger'],
        [2, 'success'],
        [1, 'info']
      ])
      return map.get(value)
    },
    handleProgramEditClick(row) {
      this.$router.push({ path: `/programs/edit/${row.id}` })
    },
    handleProgramDeleteClick(row) {
      this.$confirm('Delete all programs?', 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        const data = { programIds: this.selectedPrograms.map(pro => pro.id) }
        this.$store.dispatch('app/deletePrograms', data).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed',
            offset: 100
          })
        })
        this.page = 1
        this.searchForm.page = 1
        this.fetchProgramList()
      })
    },
    onPaginationChange() {
      this.searchForm.page = this.page
      this.searchForm.limit = this.limit
      this.fetchProgramList()
    },
    fetchProgramList(form) {
      debugger
      this.loading = true
      if (form) {
        this.$store.dispatch('app/setProgramSearchQuery', form)
      }

      this.$store.dispatch('app/searchProgram', this.programSearchQuery).then(res => {
        this.tableData = res.content
        this.totalItems = res.totalElements
      }).finally(() => {
        this.loading = false
      })
    },
    handleClear() {
      this.$store.dispatch('app/setProgramSearchQuery', new ProgramSearchForm())
    },
    handleSelectionChange(val) {
      this.selectedPrograms = val
    }

  }
}
</script>
<style>
#programTable .cell{
  word-break: break-word;
}
.filter-container{
  margin-bottom: 1rem;
}
</style>
