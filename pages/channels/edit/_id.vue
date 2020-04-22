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

export default {
  components: { Create },
  middleware: 'auth',
  data() {
    return {
      channelId: null,
      channel: null
    }
  },
  created() {
    this.channelId = this.$route.params.id
    this.$store.dispatch('app/fetchChannel', { channelId: this.channelId })
      .then(channel => {
        this.channel = channel
      })
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
