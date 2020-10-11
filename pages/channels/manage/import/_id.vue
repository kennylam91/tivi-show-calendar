<template>
  <div v-loading="loading" class="py-2">
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">{{
          COMMON.DASHBOARD
        }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/channels' }">{{
          COMMON.CHANNEL_LIST
        }}</el-breadcrumb-item>
        <el-breadcrumb-item>Manage channel</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="justify-between-align-center mb-2">
      <h5>Import {{ channel.name }} schedule</h5>
      <el-select v-model="pattern" placeholder="Select pattern" clearable style="width: 135px;">
        <el-option
          v-for="item in patternOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="importDate"
        type="date"
        placeholder="Pick a day"
        style="width: 170px;"
      />
      <el-checkbox v-model="isSearchProgram" label="Search" :indeterminate="false" />

      <el-button
        :disabled="convertBtnDisabled"
        type="primary"
        size="default"
        @click="convertData"
      > Convert</el-button>

    </div>
    <el-input
      v-model="scheduleInput"
      type="textarea"
      :autosize="{ minRows: 5, maxRows: 10 }"
      placeholder="Pick a date first"
      :disabled="scheduleInputDisabled"
      @input="validateInput"
    />
    <div v-if="errorLines.length > 0" style="color: red;">Error at line: {{ errorLines }}</div>

    <ScheduleTable
      v-if="channel"
      class="my-2"
      :schedule-list="scheduleList"
      :channel-prop="channel"
      :draft="true"
    />
    <div class="justify-between-align-cen">
      <el-button
        type="primary"
        :disabled="importBtnDisabled"
        @click="importScheduleList"
      >Import All</el-button>
      <el-button type="danger" size="medium" @click="reset">Reset</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScheduleTable from '@/components/schedules/ScheduleTable'
export default {
  components: { ScheduleTable },
  data() {
    return {
      scheduleInput: null,
      channelId: null,
      importDate: null,
      programList: null,
      scheduleList: [],
      pattern: null,
      patternOptions: [
        { value: 'en : vi', label: 'en : vi' },
        { value: 'en - vi', label: 'en - vi' },
        { value: '(en)vi', label: '(en)vi' },
        { value: 'h:mm:PM en', label: 'h:mm:PM en' },
        { value: 'arr[t,vi,en]', label: 'arr[t,vi,en]' }
      ],
      errorLines: [],
      isSearchProgram: true
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      loading: 'loading'
    }),
    channel() {
      return this.channelList.find((item) => item.id === this.channelId)
    },
    importBtnDisabled() {
      return !this.scheduleList || !this.scheduleList.length
    },
    scheduleInputDisabled() {
      return !this.importDate || !this.pattern
    },
    convertBtnDisabled() {
      return (this.errorLines.length > 0) || !this.scheduleInput
    }
  },
  watch: {},
  created() {
    this.channelId = this.getChannelId()
  },
  methods: {
    getChannelId() {
      return Number(this.$route.params.id)
    },
    validateInput() {
      this.errorLines = []
      const dataArray = this.scheduleInput.trim() ? this.scheduleInput.trim().split('\n') : []
      if (this.isSearchProgram) {
        if (this.pattern === 'en : vi') {
          dataArray.forEach((element, index) => {
            if (((element + '').match(/:/g) || []).length > 3) {
              this.errorLines.push(index + 1)
            }
          })
        } else if (this.pattern === 'en - vi') {
          dataArray.forEach((element, index) => {
            if (((element + '').match(/-/g) || []).length > 1) {
              this.errorLines.push(index + 1)
            }
          })
        }
      }
    },
    convertData() {
      // dataArray: du lieu copy vao textarea, se duoc split bang /n
      if (!this.scheduleInput.trim()) {
        return
      }
      let dataArray = []
      //       12:55AM
      // Bad Boys II
      this.scheduleInput = this.scheduleInput.replaceAll(/NOW SHOWING\s+/g, '')
      if (this.pattern === 'h:mm:PM en') {
        const arr = this.scheduleInput.trim().split('\n')
        for (let i = 0; i < arr.length; i += 2) {
          dataArray.push(arr[i] + ' ' + arr[i + 1])
        }
        this.scheduleInput = dataArray.join('\n')
      } else if (this.pattern === 'arr[t,vi,en]') {
        dataArray = this.scheduleInput.replaceAll('"', '').split('],')
      } else {
        dataArray = this.scheduleInput.trim().split('\n')
      }
      const scheduleArr = []
      if (this.importDate) {
        // ["00:20","Người Dưng","Unrelated"  ],
        // ["02:15","Ngôi Nhà Lớn","Casa Grande"  ],
        if (this.pattern === 'arr[t,vi,en]') {
          for (const str of dataArray) {
            const array = str.replaceAll('[', '').replaceAll(']', '').split(',')
            const hour = array[0].split(':')[0]
            const min = array[0].split(':')[1]
            const en = array[2].trim() ? array[2].trim() : array[1].trim()
            debugger
            const vi = array[1].trim()
            const startTime = this.importDate.setHours(hour, min, 0, 0)
            const endTime = new Date(startTime)
            endTime.setHours(24, 0, 0, 0)
            if (scheduleArr.length > 0) {
              scheduleArr[scheduleArr.length - 1].endTime = startTime
            }
            const newSchedule = {
              startTime,
              endTime,
              programName: vi + ((en && en !== vi) ? (' - ' + en) : ''),
              channelId: this.channelId,
              channelName: this.channel.name,
              programId: null,
              viName: vi,
              enName: en
            }
            scheduleArr.push(newSchedule)
          }
        } else {
          for (const str of dataArray) {
          // schedule: '00:00	BIẾN ĐI, ÔNG ANH! (GO BROTHER)'
          // array: cac truong du lieu
            const item = (str + '').substring(0, 6) +
          (str + '').substring(6).replaceAll(/:/gi, ' : ').replaceAll(/-/gi, ' - ')
            const schedule = item

            const array = schedule.split(/\s+/)
            const startTimeStr = array[0]
            const timeSplitArr = startTimeStr.split(':')
            let hour = Number(timeSplitArr[0])
            const min = Number(timeSplitArr[1].replaceAll(/[A-Z a-z]/g, ''))
            const isAM = (startTimeStr + '').match(/AM/)
            const isPM = (startTimeStr + '').match(/PM/)
            if (hour >= 12 && isAM) {
              hour -= 12
            }
            if (hour < 12 && isPM) {
              hour += 12
            }
            const startTime = this.importDate.setHours(hour, min, 0, 0)
            const endTime = new Date(startTime)
            endTime.setHours(24, 0, 0, 0)

            if (scheduleArr.length > 0) {
              scheduleArr[scheduleArr.length - 1].endTime = startTime
            }
            let vi = ''
            let en = ''
            let splitIndex
            if (this.pattern === 'en : vi') {
            // en = array[1] => :
            // vi = : => end
              splitIndex = array.indexOf(':')
            } else if (this.pattern === 'en - vi') {
              splitIndex = array.indexOf('-')
            }
            if (splitIndex > -1) {
              en = array.slice(1, splitIndex).join(' ')
              vi = array.slice(splitIndex + 1).join(' ')
            } else {
              vi = array.slice(1).join(' ')
            }
            if (this.pattern === '(en)vi') {
              const openChar = item.indexOf('(')
              const closeChar = item.indexOf(')')
              en = item.substring(openChar + 1, closeChar)
              vi = item.substring(closeChar + 1)
            }
            if (this.pattern === 'h:mm:PM en') {
              en = array.slice(1).join(' ')
            }

            const newSchedule = {
              startTime,
              endTime,
              programName: vi + (en ? (' - ' + en) : ''),
              channelId: this.channelId,
              channelName: this.channel.name,
              programId: null,
              viName: vi,
              enName: en
            }
            scheduleArr.push(newSchedule)
          }
        }
      }
      this.scheduleList = scheduleArr
      if (this.isSearchProgram) {
        this.scheduleList.forEach(schedule => {
          if (schedule.enName) {
            this.$store.dispatch('app/searchProgram', { searchName: schedule.enName.toUpperCase() }).then(res => {
              if (res.content && res.content.length === 1) {
                schedule.programId = res.content[0].id
                schedule.programName = res.content[0].name + ' - ' + res.content[0].enName
              } else if (res.content && res.content.length > 1) {
                this.$set(schedule, 'programOptions', res.content)
              }
            })
          }
        })
      }
    },
    reset() {
      this.scheduleInput = ''
      this.importDate = null
      this.scheduleList = []
    },
    importScheduleList() {
      this.$store.dispatch('app/setLoading', true)
      this.$store.dispatch('app/importSchedules', this.scheduleList).then(res => {
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
