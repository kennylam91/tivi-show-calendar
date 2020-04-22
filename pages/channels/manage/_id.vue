<template>
  <div v-if="channel">
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">Dashboard</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/channels/edit/${channel.id}`}">{{ channel.name }}</el-breadcrumb-item>
        <el-breadcrumb-item>Manage channel</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card :body-style="{ padding: '16px' }">
      <div slot="header">
        <div class="bold">{{ channel.name }}</div>
      </div>
      <ScheduleTable :schedule-list="scheduleList" @changed="handleChanged" />
    </el-card>

  </div>
</template>
<script>
import ScheduleTable from '@/components/schedules/ScheduleTable'

export default {
  components: { ScheduleTable },
  middleware: 'auth',
  data() {
    return {
      channelId: null,
      channel: null,
      scheduleList: []
    }
  },
  created() {
    this.channelId = this.$route.params.id
    this.$store.dispatch('app/fetchChannel', { channelId: this.channelId })
      .then(channel => {
        this.channel = channel
      })
    this.$store.dispatch('app/fetchScheduleList', { channelId: this.channelId }).then(scheduleList => {
      this.scheduleList = scheduleList
    })
  },
  methods: {
    handleChanged() {
      this.$store.dispatch('app/fetchScheduleList', { channelId: this.channelId }).then(scheduleList => {
        this.scheduleList = scheduleList
      })
    }
  }
}
</script>
