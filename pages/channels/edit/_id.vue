<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">Dashboard</el-breadcrumb-item>
        <el-breadcrumb-item>Edit channel</el-breadcrumb-item>
      </el-breadcrumb>
      <Create v-if="channel" class="my-2" :channel-prop="channel" @saved="handleSavedAction" @cancel="handleCancel" />
    </div>
  </div>
</template>
<script>
import Create from '@/components/channels/Create'
import { firebase } from '@/FireBase'

export default {
  components: { Create },
  middleware: 'auth',
  data() {
    return {
      channelId: null,
      channel: null,
      channelRef: firebase.firestore().collection('channels'),
      scheduleRef: firebase.firestore().collection('schedules')
    }
  },
  created() {
    this.channelId = this.$route.params.id
    this.channelRef.doc(this.channelId).onSnapshot(docSnapshot => {
      console.log(docSnapshot)
      console.log()
      this.channel = { ...docSnapshot.data(), id: docSnapshot.id }
    })

    console.log(this.channelId)
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
