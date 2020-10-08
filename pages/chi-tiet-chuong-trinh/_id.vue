<template>
  <div v-if="program">
    <div class="py-4 w-100">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item class="shorten-text" style="max-width: 70%;">
          <span>{{ program.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <section>
      <el-card shadow="never">
        <article>
          <div class="row mb-4">
            <div class="col-sm-4 col-md-3 text-center">
              <img
                v-if="program.logo"
                v-lazy="program.logo"
                class="img-fluid mb-2 "
                :alt="program.name"
              >
              <img
                v-if="!program.logo"
                class="img-fluid mb-2 "
                src="~assets/images/400x225.png"
                :alt="program.name"
              >

            </div>
            <div class="col-sm-8 col-md-9">
              <h5 class="programNameTitle">{{ program.name }} - {{ program.enName }}</h5>
              <div class="small-font-size">
                <label class="bold label">{{ COMMON.RANK }} </label>
                <!-- <el-tag :type="program.rank | getRankTagType" size="small" effect="dark">
                  {{ program.rank | getRankText }}</el-tag> -->
                <el-rate
                  v-model="program.rank"
                  style="display: inline;"
                  disabled
                  text-color="#ff9900"
                  :max="4"
                />
              </div>
              <div class="small-font-size">
                <label class="bold label">{{ COMMON.CATEGORY }} </label>
                <el-tag
                  v-for="(item, index) in program.categories"
                  :key="index"
                  size="small"
                  effect="light"
                  :type="categoryTagMap.get(item)"
                  style="margin: 2px;"
                >
                  {{ item.name }}
                </el-tag>
              </div>
              <div v-if="program.year" class="small-font-size">
                <label class="bold label">{{ COMMON.YEAR | uppercaseFirst }} </label>
                <span>{{ program.year }}</span>
              </div>
            </div>
          </div>
        </article>
        <article class="my-2">
          <h5 class="mb-4 color-dark-blue">{{ COMMON.PROGRAM_SCHEDULE_NEXT_DAYS }}</h5>
          <div>
            <table
              v-loading="loading"
              class="table table-hover small-font-size table-striped table-sm"
              style="width: 100%;"
            >
              <tr class="bold">
                <th>{{ COMMON.CHANNEL }}</th>
                <th>{{ COMMON.START }}</th>
                <th>{{ COMMON.END }}</th>
                <th />
              </tr>
              <tbody>
                <tr v-for="row in scheduleList" :key="row.id">
                  <td>
                    <el-link @click="viewChannelDetail({id: row.channelId, name: row.channelName})">
                      <span class="color-primary">{{ row.channelName }}</span>
                    </el-link>
                  </td>
                  <td class="font-sm">
                    {{ row.startTime | parseTime }}
                  </td>
                  <td class="font-sm">
                    {{ row.endTime | parseTime }}
                  </td>
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
            <div v-if="scheduleList.length > 0" class="small-font-size">
              <span> Click</span>
              <i
                class="large-font-size el-icon-bell pointer color-success bold"
              />
              <span>{{ COMMON.TO_ADD_GG_CAL }}</span> <br>
              <p v-text="COMMON.IF_NOT_WORKING_PLZ_CLEAR_CACHE" />
            </div>
          </div>
          <p
            v-if="isShowNoData"
            class="ml-4 color-info"
          >{{ COMMON.NO_DATA }}</p>
        </article>
        <el-divider />
        <article>
          <h5 class="color-dark-blue">{{ COMMON.INTRODUCTION }}</h5>
          <p class="small-font-size">{{ program.description }}</p>
          <div v-if="program.trailer" class="embed-responsive embed-responsive-16by9">
            <span v-html="program.trailer" />
          </div>
        </article>
      </el-card>
      <el-card shadow="never" />
    </section>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { parseVNTime } from '@/assets/utils/index'
import { COMMON } from '@/assets/utils/constant'
import { categoryTagMap } from '@/assets/utils/constant'

export default {
  filters: {
    parseTime(time) {
      return parseVNTime(time, '{d}/{m}/{y} {H}:{i}', true, false)
    }
  },
  asyncData({ params, store }) {
    console.log(params)
    const programId = params.id.split('_').pop().trim()
    const program = store.state.app.fromTodayProgramList && store.state.app.fromTodayProgramList.find(item => item.id === programId)
    if (!program) {
      return store.dispatch('app/fetchProgram', programId).then(program => {
        return { program, programId }
      })
    }
    return { program, programId }
  },
  data() {
    return {
      program: null,
      programId: null,
      scheduleList: [],
      categoryTagMap,
      addedSchedule: [],
      tags: [COMMON.SCHEDULE, COMMON.SCHEDULE + ' HBO', COMMON.SCHEDULE + ' FOX MOVIES',
        COMMON.SCHEDULE + ' CINEMAX', COMMON.SCHEDULE + ' AXN', COMMON.SCHEDULE + ' DISCOVERY',
        COMMON.SCHEDULE + ' RED BY HBO', COMMON.TODAY_SCHEDULE, COMMON.TODAY_SCHEDULE_2, COMMON.GOOD_MOVIE]
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      todayProgramList: 'todayProgramList',
      nextDaysProgramList: 'nextDaysProgramList',
      loading: 'loading',
      fromTodayProgramList: 'fromTodayProgramList'
    }),
    isShowNoData() {
      return this.scheduleList.length === 0 && this.loading === false
    }
  },
  watch: {
  },
  created() {
    const now = new Date()
    // const before30Mins = Date.parse(now) - 30 * 60 * 1000
    this.$store.dispatch('app/setLoading', true)
    // const schedulePromise = FB.scheduleRef.where('programId', '==', this.programId)
    //   .where('startTime', '>=', FB.timestamp.fromMillis(before30Mins))
    //   .orderBy('startTime', 'asc').get()
    // schedulePromise.then(scheduleListDoc => {
    //   scheduleListDoc.forEach(doc => {
    //     const schedule = { ...doc.data(), id: doc.id }
    //     scheduleList.push(schedule)
    //   })
    //   this.$store.dispatch('app/setLoading', false)
    //   this.scheduleList = [...scheduleList]
    // })
    const data = { startTime: now, programId: this.programId }
    this.$store.dispatch('app/searchSchedules', data).then(res => {
      this.scheduleList = res.content
    }).finally(() => this.$store.dispatch('app/setLoading', false))
  },
  methods: {
    fetchScheduleList() {
      const now = new Date()
      this.$store.dispatch('app/searchSchedules',
        { programId: this.programId, startTime: now, orderBy: ['startTime', 'asc'] }).then(list => {
        list.forEach(schedule => {
          schedule.channel = this.channelList.find(item => item.id === schedule.channelId)
        })
        this.scheduleList = list
      })
    },
    isShowAddBtn(schedule) {
      const now = new Date()
      return new Date(schedule.startTime) >= now && !this.isAddBtnDisabled(schedule)
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
      title: `${this.program.name} : Chi tiết thông tin chương trình và lịch phát sóng`,
      meta: [
        { hid: 'description', name: 'description',
          content: this.program.description }
      ]
    }
  }
}
</script>
<style scoped>
.label{
  width: 80px;
}
</style>
