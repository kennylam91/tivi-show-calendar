<template>
  <div>
    <el-card shadow="never" :body-style="{ padding: '16px' }">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">Dashboard</el-breadcrumb-item>
          <el-breadcrumb-item>Create Channel</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <CreateChannel :channel-prop="newChannel" @saved="handleSaved" @cancel="handleCancel" />

    </el-card>

  </div>
</template>
<script>
import CreateChannel from '@/components/channels/CreateChannel'
export default {
  components: { CreateChannel },
  middleware: 'auth',
  data() {
    return {
      newChannel: {
        channelId: null,
        name: '',
        description: '',
        vip: false,
        logoUrl: '',
        networkId: null

      }
    }
  },
  methods: {
    handleSaved() {
      this.$router.push({ path: '/channels' })
    },
    handleCancel() {
      this.$router.push({ path: '/channels' })
    }
  }
}
</script>
