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
import { getScheduleArray } from '@/assets/utils/index'
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
        { value: 'vtv html', label: 'vtv html' },
        { value: 'htv', label: 'htv' },
        { value: 'en - vi', label: 'en - vi' },
        { value: '(en)vi', label: '(en)vi' },
        { value: 'h:mm:PM en', label: 'h:mm:PM en' },
        { value: 'arr[t,vi,en]', label: 'arr[t,vi,en]' }
      ],
      errorLines: [],
      isSearchProgram: false
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
      if (!this.scheduleInput.trim()) { return }
      if (this.importDate) {
        this.scheduleList = getScheduleArray(this.pattern, this.scheduleInput, this.importDate, this.channel)
      }
      if (this.isSearchProgram) {
        this.scheduleList.forEach(schedule => {
          const startTime = new Date(schedule.startTime)
          if (startTime.getHours() >= 5) {
            const rqBody = { searchName: (schedule.enName.toUpperCase() || schedule.viName.toUpperCase()) }
            this.$store.dispatch('app/searchProgram', rqBody).then(res => {
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
