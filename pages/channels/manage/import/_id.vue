<template>
  <div v-loading="loading" class="py-2">

    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">{{ COMMON.DASHBOARD }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/channels' }">{{ COMMON.CHANNEL_LIST }}</el-breadcrumb-item>
        <el-breadcrumb-item>Manage channel</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="justify-between-align-center mb-2">
      <h5>Import Schedule</h5>
      <el-date-picker
        v-model="importDate"
        type="date"
        placeholder="Pick a day"
      />
    </div>
    <el-input
      v-model="scheduleInput"
      type="textarea"
      :autosize="{ minRows: 5, maxRows: 10}"
      placeholder="Pick a date first"
      :disabled="!importDate"
      @input="handleInputChange"
    />
    <ScheduleTable
      v-if="channel"
      class="my-2"
      :schedule-list="scheduleList"
      :channel-prop="channel"
      :draft="true"
    />
    <el-button type="primary" @click="importScheduleList">Import All</el-button>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScheduleTable from '@/components/schedules/ScheduleTable'
import { FB } from '@/assets/utils/constant'
export default {
  components: { ScheduleTable },
  data() {
    return {
      scheduleInput: null,
      channelId: null,
      channel: null,
      importDate: null,
      programList: null,
      scheduleList: [],
      defaultProgram: { 'logo': '',
        'description': '',
        'isNextDaysShow': true,
        'rank': 1,
        'isTodayShow': true,
        'name': 'Defaul',
        'channels': ['WnzraFRhnu1FKfeRLNCR', 'exhZ2BgF84IFzA0dONhb', 'dcBypFESR46POmThVFOq',
          'YWsE3a5hcLIAAvoNfETK', 'elFt9Fy6Dz51UPKLHhM5', 'JSVQGwve15mjQxlQhRdJ', '880MoAihKgPWbdfrNwIT',
          '4NXIQYHUSm2rdfur1Eob', 'N0gf5TR1VLlwLETqDab0', 'lcNJBsaPQ1MhYLQnyxC0', 'wELkPU0ANusKBusDba9H'],
        'id': 'FeoyRxLLN3QIkrFiFIrF',
        'categories': [] }

    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      loading: 'loading'
    })
  },
  watch: {
    programList: {
      immediate: true,
      deep: true,
      handler() {
        if (!this.programList) {
          this.$store.dispatch('app/fetchProgramList',
            { channelId: this.$route.params.id }).then(list => {
            this.programList = [...list]
          })
        }
      }
    }
  },
  created() {
    this.channelId = this.$route.params.id
  },
  methods: {
    handleInputChange() {
      console.log('handleInputChange')
      const dataArray = this.scheduleInput.trim() ? this.scheduleInput.trim().split('\n') : []
      const scheduleArr = []
      if (this.importDate) {
        for (const schedule of dataArray) {
          const array = schedule.split(/\s+/, 3)

          const startTime = array[0]
          const timeSplitArr = startTime.split(':')
          const startTimestamp = FB.timestamp.fromMillis(
            this.importDate.setHours(timeSplitArr[0], timeSplitArr[1], 0, 0))

          // find program
          const foundPrograms = this.programList.filter(item => {
            const nameArr = item.name.split(/\s/)
            return nameArr[0].toLowerCase() === array[1].toLowerCase()
            // if (array.length === 2) {
            //   return nameArr[0].toLowerCase() === array[1].toLowerCase()
            // } else {
            //   return nameArr[0].toLowerCase() === array[1].toLowerCase() &&
            //   nameArr[1].toLowerCase() === array[2].toLowerCase()
            // }
          })
          let program
          if (foundPrograms.length === 1) {
            program = foundPrograms[0]
          } else {
            program = this.defaultProgram
          }
          this.channel = this.channelList.find(item => item.id === this.channelId)
          if (scheduleArr.length > 0) {
            scheduleArr[scheduleArr.length - 1].endTime = startTimestamp
          }
          const newSchedule = {
            startTime: startTimestamp,
            programName: program.name,
            categories: program.categories,
            channelId: this.channelId,
            channelName: this.channel.name,
            endTime: startTimestamp,
            programId: program.id
          }
          scheduleArr.push(newSchedule)
        }
      }
      this.scheduleList = scheduleArr
    },
    importScheduleList() {
      console.log('importScheduleList')
      const batch = FB.db.batch()
      for (const schedule of this.scheduleList) {
        const docRef = FB.scheduleRef.doc() // auto generate unique id
        batch.set(docRef, schedule)
      }
      this.$store.dispatch('app/setLoading', true)
      batch.commit().then(() => {
        this.$notify({
          title: 'Import Success',
          type: 'success',
          duration: '4500',
          position: 'bottom-right'
        })
        this.$store.dispatch('app/setLoading', false)
        this.moveToChannelManageView(this.channel)
      })
    }
  }
}
</script>
