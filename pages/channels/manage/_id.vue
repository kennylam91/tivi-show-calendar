<template>
  <div v-if="channel">
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">{{ COMMON.DASHBOARD }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/channels' }">{{ COMMON.CHANNEL_LIST }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/channels/edit/${channel.id}`}">{{ channel.name }}</el-breadcrumb-item>
        <el-breadcrumb-item>Manage channel</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card :body-style="{ padding: '16px' }">
      <div slot="header">
        <div class="mb-2 flex" style="">
          <img class="mr-2" :src="channel.logo" height="60">
          <p class="small-font-size">{{ channel.description }}</p>
        </div>
        <div class="row">
          <div class="my-2 col-xs-12 col-sm-8 col-md-6">
            <span class="">{{ COMMON.DATE | uppercaseFirst }}: </span>
            <el-date-picker
              v-model="selectedDate"
              format="dd/MM/yyyy"
              size="small"
              type="date"
            />
          </div>
          <div class="my-2 col-xs-12 col-sm-4 col-md-6">
            <el-input
              v-model="searchText"
              :placeholder="COMMON.SEARCH"
              size="small"
              clearable
              @change="searchProgram"
            />
          </div>
        </div>
      </div>
      <ScheduleTable
        :channel-prop="channel"
        :schedule-list="scheduleData"
        @changed="handleChanged"
      />
    </el-card>

  </div>
</template>
<script>
import ScheduleTable from '@/components/schedules/ScheduleTable'
import { mapGetters } from 'vuex'
export default {
  components: { ScheduleTable },
  middleware: 'auth',
  data() {
    return {
      channelId: null,
      channel: null,
      scheduleList: [],
      selectedDate: new Date(),
      searchText: '',
      scheduleData: []
    }
  },
  computed: {
    ...mapGetters({
      todayProgramList: 'todayProgramList',
      nextDaysProgramList: 'nextDaysProgramList',
      channelList: 'channelList'
    })
  },
  watch: {
    selectedDate() {
      this.getScheduleList()
    },
    channelList: {
      immediate: true,
      handler() {
        this.channelId = this.$route.params.id
        if (this.channelList) {
          this.channel = this.channelList.find(item => item.id === this.channelId)
        } else {
          this.$store.dispatch('app/fetchChannel', { channelId: this.channelId }).then(channel => {
            this.channel = channel
          })
        }
      }
    }

  },
  created() {
    this.getScheduleList()
  },
  methods: {
    // handle when schedule list change
    handleChanged() {
      this.getScheduleList().then(() => {
        // need to wait to execute
        this.updateTodayProgramList()
        this.updateNextDaysProgramList()
      })
    },
    getScheduleList() {
      return new Promise((resolve, reject) => {
        this.fetchScheduleList(this.channelId, this.selectedDate).then(scheduleList => {
          this.scheduleList = scheduleList
          this.searchText = ''
          this.scheduleData = this.scheduleList
          resolve()
        })
      })
    },
    searchProgram() {
      this.scheduleData = this.searchText
        ? this.scheduleList.filter(schedule => schedule.programName.toLowerCase().includes(this.searchText.toLowerCase()))
        : this.scheduleList
    }
  }
}
</script>
