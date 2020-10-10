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
        { value: '(en)vi', label: '(en)vi' }
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
      const dataArray = this.scheduleInput.trim().split('\n')
      const scheduleArr = []
      if (this.importDate) {
        for (const str of dataArray) {
          // schedule: '00:00	BIẾN ĐI, ÔNG ANH! (GO BROTHER)'
          // array: cac truong du lieu
          const item = (str + '').substring(0, 6) +
          (str + '').substring(6).replaceAll(/:/gi, ' : ').replaceAll(/-/gi, ' - ')
          const schedule = item
            .replace('Phim truyện :', '')
            .replace('Phim Sitcom : ', '')
            .replace('Phim Việt Nam:', '')
            .replace('Phim tài liệu:', '')
            .replace('Phim hoạt hình:', '')
            .replace('Ký sự truyền hình:', '')
            .replace('Phim Ấn Độ:', '')
            .replace('Phim Thổ Nhĩ Kỳ:', '')
            .replace('Sitcom:', '')
            .replace('Phim Đài Loan:', '')
            .replace('Phim Ukraina:', '')
            .replace('Phim ngắn:', '')
            .replace('Phim sitcom:', '')

          const array = schedule.split(/\s+/)
          // for (let index = 0; index < array.length; index++) {
          //   const element = array[index]
          //   array[index] = element.replace(/-.*/gi, '')
          // }
          const startTimeStr = array[0]
          const timeSplitArr = startTimeStr.split(':')
          const hour = Number(timeSplitArr[0])
          const min = Number(timeSplitArr[1])
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
      this.scheduleList = scheduleArr
      if (this.isSearchProgram) {
        this.scheduleList.forEach(schedule => {
          if (schedule.enName) {
            this.$store.dispatch('app/searchProgram', { searchName: schedule.enName }).then(res => {
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
