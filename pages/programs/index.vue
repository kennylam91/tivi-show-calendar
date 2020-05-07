<template>
  <div>
    <el-card :body-style="{ padding: '5px' }">
      <div slot="header" class="justify-between-align-center">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">Dashboard</el-breadcrumb-item>
          <el-breadcrumb-item>Program List</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button
          type="primary"
          size="small"
          plain
          @click="handleCreateProgramClick"
        >Create Program</el-button>
      </div>

      <ProgramSearchForm :data-prop="programSearchQuery" @search="filterProgramList" @clear="handleClear" />

      <el-table
        id="programTable"
        :key="programTableKey"
        :data="tableData"
        border
        stripe
      >
        <el-table-column
          prop="name"
          :label="COMMON.PROGRAM_NAME"
          min-width="40"
        />
        <el-table-column
          :label="COMMON.RANK"
          align="center"
          min-width="13"
        >
          <template slot-scope="{row}">
            <el-tag v-if="row.rank" effect="dark" :type="getRankTagType(row.rank)">
              {{ row.rank | getRankLabel }}
            </el-tag>

          </template>
        </el-table-column>
        <el-table-column
          :label="COMMON.CATEGORY"
          min-width="29"
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
              >{{ item | getCategory }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          :label="COMMON.ACTION"
          min-width="18"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleProgramEditClick(scope.row)"
            >Edit</el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleProgramDeleteClick(scope.row)"
            >Delete</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div>
        <el-pagination
          :current-page.sync="pagination.page"
          :page-sizes="[20, 50, 100]"
          :page-size.sync="pagination.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="programsNumber"
        />
      </div>

    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { FB } from '@/assets/utils/constant'
import { programRankMap, programRankOptions } from '@/assets/utils/constant'
import ProgramSearchForm from '@/components/programs/ProgramSearchForm'

export default {
  middleware: 'auth',
  components: { ProgramSearchForm },
  filters: {
    getRankLabel(value) {
      if (value) {
        return programRankMap.get(value)
      }
      return ''
    }

  },
  data() {
    return {
      pagination: {
        page: 1,
        limit: 20
      },
      tableData: null,
      programListData: [],
      programList: null,
      programTableKey: 0,
      programRankOptions

    }
  },
  computed: {
    ...mapGetters({
      // programList: 'programList',
      programSearchQuery: 'programSearchQuery'
    }),
    programsNumber() {
      return this.programListData.length
    }
  },
  watch: {
    pagination: {
      deep: true,
      handler() {
        this.handlePaginationChange()
      }
    },
    programList: {
      deep: true,
      handler() {
        this.filterProgramList(this.programSearchQuery)
      }
    },
    programListData: {
      deep: true,
      handler() {
        this.handlePaginationChange()
      }
    }
  },
  created() {
    if (!this.programList) {
      this.fetchAllProgram({})
    }
    // this.listQuery.name = this.$route.query.q
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
    handleCreateProgramClick() {
      console.log('handleCreateProgramClick')
      this.$router.push({ path: '/programs/create' })
    },
    handleProgramEditClick(row) {
      console.log(row)
      this.$router.push({ path: `/programs/edit/${row.id}` })
    },
    handleProgramDeleteClick(row) {
      console.log(row)
      this.$confirm('Delete this program?', 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('app/deleteProgram', { programId: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed',
            offset: 100
          })
          this.programTableKey++
        })
      })
    },
    filterProgramList(searchForm) {
      this.programListData = []
      this.$store.dispatch('app/setProgramSearchQuery', searchForm)
      if (this.programList) {
        this.programListData = this.programList.filter(program => {
          return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm) &&
        this.filterByRank(program, searchForm)
        })
        this.handlePaginationChange()
      }
    },
    handlePaginationChange() {
      const start = (this.pagination.page - 1) * this.pagination.limit
      const end = this.pagination.page * this.pagination.limit
      this.tableData = this.programListData.slice(start, end)
    },
    fetchAllProgram(request) {
      let programQuery = FB.programRef
      if (request.channelId) {
        programQuery = programQuery.where('channels', 'array-contains', request.channelId)
      }
      if (request.schedules) {
        programQuery = programQuery.where('schedules', 'array-contains-any', request.schedules)
      }

      return programQuery.orderBy('name', 'asc').onSnapshot(snapShot => {
        const list = []
        snapShot.forEach(doc => {
          const program = { ...doc.data(), id: doc.id }
          list.push(program)
        })
        this.programList = [...list]
      })
    },
    handleClear() {
      this.programListData = this.programList
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
