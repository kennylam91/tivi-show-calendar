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
    programList: {
      immediate: true,
      handler() {
        this.programId = this.$route.params.id
        if (this.programList) {
          this.program = this.programList.find(item => item.id === this.programId)
        } else {
          this.$store.dispatch('app/fetchProgram', { programId: this.programId }).then(data => {
            this.program = data
          })
        }
      }
    }
  },
  created() {

  },
  methods: {
    handleSavedAction() {
      this.$router.push({ path: '/programs' })
    },
    handleCancel() {
      this.$router.push({ path: '/programs' })
    }
  }
}
</script>
