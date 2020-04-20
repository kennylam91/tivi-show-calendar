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
      <el-table :data="channelList" border stripe>
        <el-table-column
          prop="name"
          label="Name"
        />
        <el-table-column
          prop="description"
          label="Description"
        />
        <el-table-column
          align="center"
          label="Operations"
          width="270"
        >
          <template slot-scope="scope">
            <el-button size="small" @click="handleChannelEditClick(scope.row)">Edit</el-button>
            <el-button type="success" size="small" @click="handleScheduleManageClick(scope.row)">Schedule</el-button>
            <el-button type="danger" size="small" @click="handleChannelDeleteClick(scope.row)">Delete</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>
<script>
import { firebase } from '../../FireBase'

export default {
  middleware: 'auth',
  data() {
    return {
      channelList: [],
      programList: [],
      programRef: firebase.firestore().collection('programs'),
      channelRef: firebase.firestore().collection('channels')
    }
  },
  created() {
    this.programRef.orderBy('name', 'asc').onSnapshot((querySnapshot) => {
      this.programList = []
      querySnapshot.forEach((program) => {
        this.programList.push({
          id: program.id,
          name: program.data().name,
          description: program.data().description
        })
      })
    })
    this.channelRef.onSnapshot((querySnapshot) => {
      this.channelList = []
      querySnapshot.forEach((channel) => {
        this.channelList.push({ ...channel.data(), id: channel.id })
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
        this.programRef.doc(row.id).delete().then(() => {
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
    },
    handleChannelEditClick(row) {
      this.$router.push({ path: `/channels/edit/${row.id}` })
    },
    handleChannelDeleteClick(row) {
      this.$confirm('Delete this channel?', 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.channelRef.doc(row.id).delete().then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed'
          })
        })
      })
    },
    handleScheduleManageClick(row) {
      console.log('handleScheduleManageClick')
      this.$router.push({ path: `/channels/manage/${row.id}` })
    }
  }
}
</script>
