<template>
  <div>
    <el-card :body-style="{ padding: '16px' }">
      <div slot="header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">Dashboard</el-breadcrumb-item>
          <el-breadcrumb-item>Create Channel</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <Create :channel-prop="newChannel" @saved="handleSaved" />

    </el-card>

  </div>
</template>
<script>
import Create from '@/components/channels/Create'
export default {
  components: { Create },
  middleware: 'auth',
  data() {
    return {
      newChannel: {
        id: null,
        name: '',
        description: ''
      }
    }
  },
  methods: {
    handleSaved() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>
