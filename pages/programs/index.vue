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
      <el-table id="programTable" :data="programList" border stripe>
        <el-table-column
          prop="name"
          label="Name"
        />
        <el-table-column
          label="Category"
        >
          <template slot-scope="{row}">
            <div>{{ row.category | getCategory }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="Description"
        />
        <el-table-column
          align="center"
          label="Operations"
          width="180"
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
import { firebase } from '../../FireBase'
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth',
  data() {
    return {
      programRef: firebase.firestore().collection('programs')
    }
  },
  computed: {
    ...mapGetters({
      programList: 'programList'
    })
  },
  created() {
    if (!this.programList) {
      this.$store.dispatch('app/fetchProgramList')
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
          this.$store.dispatch('app/fetchProgramList').then(list => {
            this.programList = list
          })
        })
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
