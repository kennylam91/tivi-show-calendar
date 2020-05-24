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
import { firebase } from '@/MyFireBase'
import { getStartOfDayInGMT7 } from '@/assets/utils/index'
import { Program } from '@/assets/model/Program'
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
      defaultProgram: { ...new Program(),
        channels: ['WnzraFRhnu1FKfeRLNCR', 'exhZ2BgF84IFzA0dONhb', 'dcBypFESR46POmThVFOq',
          'YWsE3a5hcLIAAvoNfETK', 'elFt9Fy6Dz51UPKLHhM5', 'JSVQGwve15mjQxlQhRdJ', '880MoAihKgPWbdfrNwIT',
          '4NXIQYHUSm2rdfur1Eob', 'N0gf5TR1VLlwLETqDab0', 'lcNJBsaPQ1MhYLQnyxC0', 'wELkPU0ANusKBusDba9H'] }
      // defaultProgram: { 'logo': '',
      //   'description': '',
      //   'isNextDaysShow': true,
      //   'rank': 1,
      //   'isTodayShow': true,
      //   'name': 'Defaul',
      //   'channels': ,
      //   'id': 'FeoyRxLLN3QIkrFiFIrF',
      //   'categories': [] }

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
            { channelId: this.getChannelId() }).then(list => {
            this.programList = [...list]
          })
        }
      }
    }
  },
  created() {
    this.channelId = this.getChannelId()
  },
  methods: {
    getChannelId() {
      return this.$route.params.id
    },
    handleInputChange() {
      // dataArray: du lieu copy vao textarea, se duoc split bang /n
      const dataArray = this.scheduleInput.trim() ? this.scheduleInput.trim().split('\n') : []
      const scheduleArr = []
      if (this.importDate) {
        for (let schedule of dataArray) {
          // schedule: '00:00	BIẾN ĐI, ÔNG ANH! (GO BROTHER)'
          // array: cac truong du lieu
          schedule = schedule.replace('Phim truyện :', '').replace('Phim Sitcom : ', '')
          const array = schedule.split(/\s+/)
          for (let index = 0; index < array.length; index++) {
            const element = array[index]
            array[index] = element.replace(/-.*/gi, '')
          }
          const startTimeStr = array[0]
          const timeSplitArr = startTimeStr.split(':')
          const hour = Number(timeSplitArr[0])
          const min = Number(timeSplitArr[1])
          const startTime = this.importDate.setHours(hour, min, 0, 0)

          const startTimestamp = FB.timestamp.fromMillis(startTime)

          // find program by english name
          const foundProgramsByEnName = this.programList.filter(item => {
            // mang cac tu cua ten chuong trinh
            // const nameArr = item.name.split(/\s/)
            // const compareProgramName = nameArr[1] ? nameArr[0] + ' ' + nameArr[1] : nameArr[0]
            const compareProgramName = item.name
            const isValid = array[2] && array[2].trim() !== ':' && !array[2].includes('(')
            const importProgramName = isValid ? array[1] + ' ' + array[2].replace(':', '') : array[1]
            if (compareProgramName && importProgramName) {
              return compareProgramName.toLowerCase().includes(importProgramName.toLowerCase())
            }
          })
          const foundProgramByViName = this.programList.filter(item => {
            // const nameArr = item.name.split('-')
            // const vnName = nameArr[1] ? nameArr[1] : nameArr[0]
            // const vnNameArr = vnName.trim().split(/\s/)
            // const compareProgramName = vnNameArr[1] ? vnNameArr[0] + ' ' + vnNameArr[1] : vnNameArr[0]
            const compareProgramName = item.name
            let importProgramName
            if (array[2] && array[2].trim !== ':') {
              if (array[3] && array[3].trim !== ':') {
                importProgramName = array[1] + ' ' + array[2].replace(':', '') + ' ' + array[3].replace(':', '')
              } else {
                importProgramName = array[1] + ' ' + array[2].replace(':', '')
              }
            } else {
              importProgramName = array[1]
            }
            // const isValid = array[2] && array[2].trim() !== ':'
            // const importProgramName = isValid ? array[1] + ' ' + array[2].replace(':', '') : array[1]
            if (compareProgramName && importProgramName) {
              return compareProgramName.toLowerCase().includes(importProgramName.toLowerCase())
            }
          })

          let program
          if (foundProgramsByEnName.length === 1) {
            program = foundProgramsByEnName[0]
          } else if (foundProgramByViName.length === 1) {
            program = foundProgramByViName[0]
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
      const batch = FB.db.batch()
      for (const schedule of this.scheduleList) {
        const scheduleRef = FB.scheduleRef.doc() // auto generate unique id
        batch.set(scheduleRef, schedule)

        const programRef = FB.programRef.doc(schedule.programId)
        const startTime = new Date(schedule.startTime.seconds * 1000)
        const startOfDateInGMT7 = getStartOfDayInGMT7(startTime)
        const newSchedules = firebase.firestore.FieldValue.arrayUnion(startOfDateInGMT7)
        batch.update(programRef, { 'schedules': newSchedules })
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
