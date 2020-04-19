<template>
  <div class="p-4">
    <div class="justify-between-align-center">
      <span class="bold">DASHBOARD</span>
    </div>

    <el-card class="my-2" :body-style="{ padding: '16px' }">
      <div slot="header" class="justify-between-align-center">
        <span>Channel List</span>
        <el-button type="primary" size="small" plain @click="handleCreateChannelClick">Create Channel</el-button>
      </div>
      <!-- card body -->
    </el-card>

    <el-card class="my-2" :body-style="{ padding: '16px' }">
      <div slot="header" class="justify-between-align-center">
        <span>Program List</span>
        <el-button type="primary" size="small" plain @click="handleCreateProgramClick">Create Program</el-button>
      </div>
      <el-table :data="programList" border stripe>
        <el-table-column
          prop="name"
          label="Name"
        />
        <el-table-column
          prop="description"
          label="Description"
        />
        <el-table-column
          fixed="right"
          label="Operations"
          width="120"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleProgramEditClick(scope.row)">Edit</el-button>
            <el-button type="text" size="small" @click="handleProgramDeleteClick(scope.row)">Delete</el-button>
          </template>
        </el-table-column>

      </el-table>

    </el-card>

  </div>
</template>
<script>
import { firebase } from '../../FireBase'

export default {
  data() {
    return {
      channelList: [],
      programList: [],
      ref: firebase.firestore().collection('programs')
    }
  },
  created() {
    this.ref.onSnapshot((querySnapshot) => {
      this.programList = []
      querySnapshot.forEach((program) => {
        this.programList.push({
          id: program.id,
          name: program.data().name,
          description: program.data().description
        })
      })
    })
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
        this.ref.doc(row.id).delete().then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed'
          })
        })
      })
    },
    handleCreateChannelClick() {
      console.log('handleCreateChannelClick')
      this.$router.push({ path: '/channels/create' })
    }
  }
}
</script>
