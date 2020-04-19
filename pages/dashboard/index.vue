<template>
  <div class="p-4">
    <div class="justify-between-align-center">
      <span class="bold">DASHBOARD</span>
      <el-button type="primary" plain @click="handleCreateProgramClick">Create Program</el-button>
    </div>
    <el-card :body-style="{ padding: '16px' }">
      <div slot="header">
        <span>Program List</span>
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

      </el-table>

    </el-card>

  </div>
</template>
<script>
import { firebase } from '../../FireBase'

export default {
  data() {
    return {
      programList: []
    }
  },
  created() {
    firebase.firestore().collection('programs').onSnapshot((querySnapshot) => {
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
    }
  }
}
</script>
