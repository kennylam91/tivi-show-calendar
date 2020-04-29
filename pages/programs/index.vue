<template>
  <div>
    <el-card :body-style="{ padding: '16px' }">
      <div slot="header" class="justify-between-align-center">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">Dashboard</el-breadcrumb-item>
          <el-breadcrumb-item>Program List</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" size="small" plain @click="handleCreateProgramClick">Create Program</el-button>
      </div>
      <el-table id="programTable" :data="tableData" border stripe>
        <el-table-column
          prop="name"
          label="Name"
        >
          <template slot="header" slot-scope="{row}">
            <span>{{ COMMON.TOTAL }}: {{ programsNumber }}</span>
            <el-input
              v-model="programNameSearch"
              style="width: 60%; float: right;"
              :placeholder="COMMON.SEARCH_PROGRAM"
              @change="handleProgramSearch(row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="Category"
          width="300"
          :filters="CATEGORIES"
          :filter-method="filterCategory"
          :filter-multiple="true"
          filter-placement="bottom"
        >
          <template slot-scope="{row}">
            <div v-if="row.categories">
              <el-tag
                v-for="(item, index) in row.categories"
                :key="index"
                class="m-1"
                effect="dark"
                type="info"
              >{{ item | getCategory }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="Operations"
          width="170"
        >
          <template slot-scope="scope">
            <el-button size="small" @click="handleProgramEditClick(scope.row)">Edit</el-button>
            <el-button type="danger" size="small" @click="handleProgramDeleteClick(scope.row)">Delete</el-button>
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

export default {
  middleware: 'auth',
  data() {
    return {
      programNameSearch: '',
      pagination: {
        page: 1,
        limit: 20
      },
      tableData: null,
      programListData: []

    }
  },
  computed: {
    ...mapGetters({
      programList: 'programList'
    }),
    // programListData() {
    //   if (this.programList) {
    //     if (this.programNameSearch) {
    //       return this.programList.filter(item => item.name.toLowerCase().includes(this.programNameSearch.toLowerCase()))
    //     } else {
    //       return this.programList
    //     }
    //   } else {
    //     return []
    //   }
    // },
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
        this.handleProgramSearch()
      }
    }
  },
  created() {
    this.fetchAllProgram({})
  },
  methods: {
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
            message: 'Delete completed'
          })
          this.$store.dispatch('app/fetchProgramList', {}).then(list => {
            this.programList = list
          })
        })
      })
    },
    handleProgramSearch() {
      if (this.programNameSearch) {
        this.programListData = this.programList.filter(item => item.name.toLowerCase().includes(this.programNameSearch.toLowerCase()))
      } else {
        this.programListData = this.programList
      }
      this.handlePaginationChange()
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
      const list = []
      return programQuery.orderBy('name', 'asc').onSnapshot(snapShot => {
        snapShot.forEach(doc => {
          const program = { ...doc.data(), id: doc.id }
          list.push(program)
        })
        this.$store.dispatch('app/setProgramList', list)
        debugger
      })
    }

  }
}
</script>
<style>
#programTable .cell{
  word-break: break-word;
}
</style>
