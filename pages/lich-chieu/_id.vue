/* eslint-disable no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-undef */
<template>
  <div v-if="channel">
    <div class="py-4 px-2">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/danh-sach-kenh' }">{{ COMMON.CHANNEL_LIST }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ channel.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card shadow="never" :body-style="{ padding: '10px' }">
      <div class="row">
        <div
          class="col-sm-4 col-md-2 text-center mb-2 pt-1"
          style="padding-left: 15px;padding-right: 15px; "
        >
          <img v-lazy="channel.logo" class="img-fluid" :alt="channel.name">
        </div>
        <div
          class="col-sm-8 col-md-10 flex"
          style="padding-left: 15px;padding-right: 15px; align-items: center "
        >
          <p class="small-font-size">{{ channel.description }}</p>
        </div>
      </div>
      <el-divider class="my-2" />
      <h4 class="my-4 color-dark-blue">{{ COMMON.SCHEDULE + ' ' + channel.name + ' ' + COMMON.DATE + ' ' + selectedDateFormatted }}</h4>
      <div class="row">
        <div
          class="my-2 col-6 col-sm-6 col-md-4"
          style="padding-right: 5px; padding-left: 15px;"
        >
          <el-date-picker
            v-model="selectedDate"
            format="dd/MM/yyyy"
            type="date"
            class="w-100"
          />
        </div>
        <div
          class="my-2 col-6 col-sm-4 offset-md-4 col-md-4"
          style="padding-right: 15px; padding-left: 5px;"
        >
          <el-input
            v-model="searchText"
            :placeholder="COMMON.SEARCH"
            clearable
            @change="searchProgram"
          />
        </div>
      </div>
      <div v-if="scheduleData">
        <table
          id="scheduleTable"
          v-loading="tableLoading"
          class="table table-hover table-striped"
        >
          <tr class="text-left color-dark-blue">
            <th scope="col">
              <span>Time</span>
            </th>
            <th scope="col">
              <span>{{ COMMON.PROGRAM_NAME }}</span>
            </th>
            <!-- <th class="categoryColumn">{{ COMMON.CATEGORY }}</th> -->
            <td />
          </tr>
          <tbody v-if="scheduleData.length > 0">
            <tr
              v-for="(row, index) in scheduleData"
              :key="index"
              :class="{scheduleInShowing : isShowing(row)}"
            >
              <td style="">
                <span>{{ parseTime(row.startTime.seconds) }}</span>
              </td>
              <td>
                <el-link
                  :underline="false"
                  @click="viewProgramDetail(row)"
                >
                  <span>{{ row.programName | uppercaseAll }}</span>
                </el-link>
              </td>
              <!-- <td class="categoryColumn">
              <el-tag
                v-for="item in row.categories.filter(item => item !== 1)"
                :key="item"
                size="small"
                effect="dark"
                :type="categoryTagMap.get(item)"
                style="margin: 2px;"
              >
                {{ item | getCategory }}
              </el-tag>
            </td> -->
              <td>
                <el-tooltip :content="COMMON.ADD_TO_GOOGLE_CAL" placement="top-start" effect="dark">
                  <i
                    v-if="isShowAddBtn(row)"
                    class="large-font-size el-icon-bell pointer color-success bold"
                    @click="addScheduleToGGCal(row)"
                  />
                </el-tooltip>

              </td>
            </tr>
          </tbody>
        </table>
        <p
          v-if="isShowNoData"
          class="ml-4"
        >{{ COMMON.UPDATING }}</p>
        <div v-if="scheduleData.length > 0" class="small-font-size">
          <span> Click</span>
          <i
            class="large-font-size el-icon-bell pointer color-success bold"
          />
          <span>{{ COMMON.TO_ADD_GG_CAL }}</span><br>
          <p v-text="COMMON.IF_NOT_WORKING_PLZ_CLEAR_CACHE" />
        </div>
      </div>

    </el-card>

  </div>
</template>
<script>
import { parseVNTime } from '@/assets/utils/index'
import { mapGetters } from 'vuex'
import { COMMON } from '@/assets/utils/constant'
import { categoryTagMap } from '@/assets/utils/constant'

export default {
  asyncData({ params, store }) {
    const channelId = params.id.split('_').pop()
    const channel = store.state.app.channelList.find(item => item.id === channelId)

    // const channelName = params.id.split('_')[0]
    // let scheduleData
    // const start = new Date()
    // start.setHours(0, 0, 0, 0)
    // const startTimestamp = FB.timestamp.fromDate(start)

    // const end = new Date()
    // end.setHours(23, 59, 59, 999)
    // const endTimestamp = FB.timestamp.fromDate(end)

    // const promise0 = store.dispatch('app/fetchScheduleList',
    //   { channelId: channelId,
    //     startTime: startTimestamp,
    //     endTime: endTimestamp })

    // const channel = store.state.app.channelList.find(item => item.id === channelId)
    // return promise0.then(list => {
    //   scheduleData = list
    //   return { channel, scheduleData, channelId }
    // })
    return { channelId, channel }
  },
  data() {
    return {
      channelId: null,
      scheduleList: [],
      program: null,
      detailProgramDlgVisible: false,
      selectedDate: new Date(),
      searchText: '',
      scheduleData: null,
      channel: null,
      categoryTagMap: categoryTagMap,
      addedSchedule: [],
      tableLoading: false
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      loading: 'loading'
    }),
    selectedDateFormatted() {
      return parseVNTime(this.selectedDate, '{d}/{m}/{y}', true, true)
    },
    isShowNoData() {
      if (this.scheduleData) {
        return this.scheduleData.length === 0
      }
      return false
    }
  },
  watch: {
    selectedDate(newValue, oldValue) {
      if (!this.scheduleData) {
        this.getScheduleList()
      }
      if (newValue.getDate() !== oldValue.getDate() ||
      newValue.getMonth() !== oldValue.getMonth()) {
        this.getScheduleList()
      }
    }
  },
  created() {
    const dateParam = this.$route.query.date || new Date()
    if (dateParam) {
      this.selectedDate = dateParam
    }
  },
  methods: {
    parseTime(time) {
      return parseVNTime(time, '{H}:{i} ', true, true)
    },
    getScheduleList() {
      this.tableLoading = true
      this.fetchScheduleList(this.channelId, this.selectedDate).then(scheduleList => {
        this.scheduleList = scheduleList
        this.searchText = ''
        this.scheduleData = this.scheduleList
        this.tableLoading = false
      })
    },
    searchProgram() {
      this.scheduleData = this.searchText
        ? this.scheduleList.filter(schedule => schedule.programName.toLowerCase().includes(this.searchText.toLowerCase()))
        : this.scheduleList
    },
    isShowing(schedule) {
      const now = new Date()
      return (schedule.startTime.seconds * 1000 <= Date.parse(now) &&
      schedule.endTime.seconds * 1000 >= Date.parse(now))
    },
    isShowAddBtn(schedule) {
      const now = new Date()
      return schedule.startTime.seconds * 1000 >= now && !this.isAddBtnDisabled(schedule)
    },
    isAddBtnDisabled(schedule) {
      return this.addedSchedule.some(item => item.id === schedule.id)
    },
    addScheduleToGGCal(schedule) {
      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get()
      if (!isSignedIn) {
        gapi.auth2.getAuthInstance().signIn().then(() => {
        })
      } else {
        this.addEvent(schedule)
      }
    },
    addEvent(schedule) {
      const event = {
        'summary': schedule.channelName + '-' + schedule.programName,
        'start': {
          'dateTime': new Date(schedule.startTime.seconds * 1000),
          // 'dateTime': new Date(2020, 5, 7, 0, 0, 0, 0),
          'timeZone': 'Etc/GMT+7'
        },
        'end': {
          'dateTime': new Date(schedule.endTime.seconds * 1000),
          // 'dateTime': new Date(2020, 5, 8, 0, 0, 0, 0),
          'timeZone': 'Etc/GMT+7'
        },
        'reminders': {
          'useDefault': false,
          'overrides': [
            { 'method': 'popup', 'minutes': 10 }
          ]
        }
      }
      var request = gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      })
      request.execute((event) => {
        this.$message({
          offset: 100,
          message: this.COMMON.SCHEDULE_ADDED_SUCCESS,
          type: 'success',
          center: true
        })
        this.addedSchedule.push(schedule)
      })
    }
  },
  head() {
    return {
      title: `Truyền hình 24h - ${COMMON.SCHEDULE} ${this.channel.name}`,
      meta: [
        { hid: 'description', name: 'description',
          content: `Cập nhật lịch phát sóng hàng ngày và tổng hợp các chương trình hay nhất trên kênh ${this.channel.name}. 
          ${this.channel.description} ` }
      ]
    }
  }
}
</script>
<style>
#scheduleTable .cell {
  word-break: break-word;
}

</style>

