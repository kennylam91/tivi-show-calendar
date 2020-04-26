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
      <el-table id="programTable" :data="programListData" border stripe>
        <el-table-column
          prop="name"
          label="Name"
        >
          <template slot="header" slot-scope="{row}">
            <span>{{ COMMON.TOTAL }}: {{ programsNumber }}</span>
            <el-input
              v-model="programNameSearch"
              size="mini"
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

    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth',
  data() {
    return {
      programNameSearch: ''
    }
  },
  computed: {
    ...mapGetters({
      programList: 'programList'
    }),
    programListData() {
      if (this.programList) {
        if (this.programNameSearch) {
          return this.programList.filter(item => item.name.toLowerCase().includes(this.programNameSearch.toLowerCase()))
        } else {
          return this.programList
        }
      } else {
        return []
      }
    },
    programsNumber() {
      return this.programListData.length
    }
  },
  created() {
    if (!this.programList) {
      this.$store.dispatch('app/fetchProgramList', {})
    }
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

    }

  }
}
</script>
<style>
#programTable .cell{
  word-break: break-word;
}
</style>
