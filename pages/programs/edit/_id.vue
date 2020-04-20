<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">Dashboard</el-breadcrumb-item>
        <el-breadcrumb-item>Edit Program</el-breadcrumb-item>
      </el-breadcrumb>
      <Create v-if="program" class="my-2" :program-prop="program" @saved="handleSavedAction" @cancel="handleCancel" />
    </div>
  </div>
</template>
<script>
import Create from '@/components/programs/Create'
import { firebase } from '@/FireBase'

export default {
  components: { Create },
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
      this.$router.push({ path: '/dashboard' })
    },
    handleCancel() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>
