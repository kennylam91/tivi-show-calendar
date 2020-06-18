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
      <h5>Import {{ channel.name }} schedule </h5>
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
    <el-button type="primary" :disabled="importBtnDisabled" @click="importScheduleList">Import All</el-button>

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
    }),
    channel() {
      return this.channelList.find(item => item.id === this.channelId)
    },
    importBtnDisabled() {
      return !this.scheduleList || !this.scheduleList.length
    }
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
        for (const item of dataArray) {
          // schedule: '00:00	BIẾN ĐI, ÔNG ANH! (GO BROTHER)'
          // array: cac truong du lieu
          const schedule = item.replace('Phim truyện :', '').replace('Phim Sitcom : ', '')
            .replace('Phim Việt Nam:', '').replace('Phim tài liệu:', '').replace('Phim hoạt hình:', '')
            .replace('Ký sự truyền hình:', '').replace('Phim Ấn Độ:', '').replace('Phim Thổ Nhĩ Kỳ:', '')
            .replace('Sitcom:', '').replace('Phim Đài Loan:', '').replace('Phim Ukraina:', '')
            .replace('Phim ngắn:', '').replace('Phim sitcom:', '')
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
            const compareProgramName = item.name
            const isValid = array[2] && array[2].trim() !== ':' && !array[2].includes('(')
            const importProgramName = isValid ? array[1] + ' ' + array[2].replace(':', '') : array[1]
            if (compareProgramName && importProgramName) {
              return compareProgramName.toLowerCase().includes(importProgramName.toLowerCase())
            }
          })
          const foundProgramByViName = this.programList.filter(item => {
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
            // create new program
            program = this.defaultProgram
          }
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
        const channelRef = FB.channelRef.doc(this.channelId)
        batch.update(channelRef, { 'schedules': newSchedules })
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
        this.scheduleInput = ''
        this.scheduleList = null
        // this.moveToChannelManageView(this.channel)
      })
    }
  }
}
</script>
