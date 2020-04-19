<template>
  <div class="p-4">
    <div class="justify-between-align-center">
      <span class="bold">DASHBOARD</span>
    <el-button type="primary" @click="handleCreateProgramClick" plain>Create Program</el-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleCreateProgramClick () {
      console.log('handleCreateProgramClick')
      this.$router.push({ path: '/programs/create' })
    }
  }
}
</script>
