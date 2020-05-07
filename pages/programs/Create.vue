<template>
  <div class="p-4">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">Dashboard</el-breadcrumb-item>
      <el-breadcrumb-item>Create Program</el-breadcrumb-item>
    </el-breadcrumb>
    <CreateProgram class="my-2" :program-prop="newProgram" @saved="handleSavedAction" @cancel="handleCancel" />

  </div>
</template>
<script>
import CreateProgram from '@/components/programs/CreateProgram'
export default {
  components: { CreateProgram },
  middleware: 'auth',
  data() {
    return {
      newProgram: {
        id: '',
        name: '',
        description: '',
        logo: '',
        isTodayShow: true,
        isNextDaysShow: true,
        categories: null,
        rank: 1
      }
    }
  },
  methods: {
    handleSavedAction() {
      // this.$router.push({ path: '/programs' })
    },
    handleCancel() {
      console.log('handle cancel click')
      // this.$router.push({ path: '/programs' })
    }
  }
}
</script>
