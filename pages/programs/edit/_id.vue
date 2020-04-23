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
import { firebase } from '@/MyFireBase'

export default {
  components: { CreateProgram },
  middleware: 'auth',
  data() {
    return {
      programId: null,
      program: null,
      ref: firebase.firestore().collection('programs')
    }
  },
  created() {
    this.programId = this.$route.params.id
    this.ref.doc(this.programId).onSnapshot(docSnapshot => {
      console.log(docSnapshot)
      console.log()
      this.program = { ...docSnapshot.data(), id: docSnapshot.id }
    })
    console.log(this.programId)
  },
  methods: {
    handleSavedAction() {
      console.log('handleSavedAction')
      this.$store.dispatch('app/fetchProgramList', {})
      this.$router.push({ path: '/programs' })
    },
    handleCancel() {
      this.$router.push({ path: '/programs' })
    }
  }
}
</script>
