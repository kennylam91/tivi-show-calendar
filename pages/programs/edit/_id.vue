<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">Dashboard</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/programs' }">Programs</el-breadcrumb-item>
        <el-breadcrumb-item>Edit Program</el-breadcrumb-item>
      </el-breadcrumb>
      <CreateProgram v-if="program" class="my-2" :program-prop="program" @saved="handleSavedAction" @cancel="handleCancel" />
    </div>
  </div>
</template>
<script>
import CreateProgram from '@/components/programs/CreateProgram'
import { mapGetters } from 'vuex'

export default {
  components: { CreateProgram },
  middleware: 'auth',
  data() {
    return {
      programId: null,
      program: null
    }
  },
  computed: {
    ...mapGetters({
      programList: 'programList',
      programSearchQuery: 'programSearchQuery'
    })
  },
  watch: {
  },
  created() {
    this.programId = Number(this.$route.params.id)
    this.fetchProgramDetail()
  },
  methods: {
    handleSavedAction() {
      this.$router.push({ path: '/programs' })
    },
    handleCancel() {
      this.$router.push({ path: '/programs' })
    },
    fetchProgramDetail() {
      this.$store.dispatch('app/fetchProgram', this.programId).then(res => {
        this.program = res
      })
    }
  }
}
</script>
