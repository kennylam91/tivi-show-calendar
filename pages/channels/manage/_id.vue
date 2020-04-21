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
      <ScheduleTable :schedule-list="scheduleList" />
    </el-card>

  </div>
</template>
<script>
import { firebase } from '@/FireBase'
import ScheduleTable from '@/components/schedules/ScheduleTable'

export default {
  components: { ScheduleTable },
  middleware: 'auth',
  data() {
    return {
      channelId: null,
      channel: null,
      channelRef: firebase.firestore().collection('channels'),
      scheduleRef: firebase.firestore().collection('schedules'),
      programRef: firebase.firestore().collection('programs'),
      scheduleList: []
    }
  },
  created() {
    this.channelId = this.$route.params.id
    this.channelRef.doc(this.channelId).onSnapshot(docSnapshot => {
      console.log(docSnapshot)
      console.log()
      this.channel = { ...docSnapshot.data(), id: docSnapshot.id }
    })
    const scheduleQuery = this.scheduleRef.where('channelId', '==', this.channelId).orderBy('startTime', 'asc')
    scheduleQuery.onSnapshot((querySnapshot) => {
      this.scheduleList = []
      querySnapshot.forEach((schedule) => {
        const programId = schedule.data().programId
        this.programRef.doc(programId).onSnapshot(doc => {
          this.scheduleList.push({ ...schedule.data(), id: schedule.id, programName: doc.data().name, category: doc.data().category })
        })
      })
      console.log(this.scheduleList)
    })

    console.log(this.channelId)
  }
}
</script>
