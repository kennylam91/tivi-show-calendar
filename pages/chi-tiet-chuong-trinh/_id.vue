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
                class="img-fluid mb-2 "
                :src="program.logo"
                :alt="program.name"
              >
              <img
                v-if="!program.logo"
                class="img-fluid mb-2 "
                src="https://via.placeholder.com/400x225"
                :alt="program.name"
              >

            </div>
            <div class="col-sm-8 col-md-9">
              <h5 class="programNameTitle">{{ program.name }}</h5>
              <div class="small-font-size mt-2">
                <label>{{ COMMON.CATEGORY }}: </label>
                <el-tag
                  v-for="(item, index) in program.categories"
                  :key="index"
                  size="small"
                  effect="dark"
                  :type="categoryTagMap.get(item)"
                  style="margin: 2px;"
                >
                  {{ item | getCategory }}
                </el-tag>
              </div>
            </div>
          </div>
        </article>
        <article class="my-2">
          <h5 class="mb-2">{{ COMMON.PROGRAM_SCHEDULE_NEXT_DAYS }}</h5>
          <div v-if="scheduleList.length > 0">
            <table
              class="table table-hover small-font-size table-sm"
            >
              <tr class="color-info bold">
                <th>{{ COMMON.CHANNEL }}</th>
                <th>{{ COMMON.START }}</th>
                <th>{{ COMMON.END }}</th>
                <th />
              </tr>
              <tbody>
                <tr v-for="row in scheduleList" :key="row.id">
                  <td>
                    <el-link @click="viewChannelDetail({id: row.channelId, name: row.channelName})">
                      <span class="color-primary bold">{{ row.channelName }}</span>
                    </el-link>
                  </td>
                  <td>
                    {{ row.startTime.seconds | parseTime }}
                  </td>
                  <td>
                    {{ row.endTime.seconds | parseTime }}
                  </td>
                  <td>
                    <i
                      v-if="isShowAddBtn(row)"
                      class="large-font-size el-icon-bell pointer color-primary"
                      @click="addScheduleToGGCal(row)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="small-font-size">
              <span> Click</span>
              <i
                class="large-font-size el-icon-bell pointer color-primary"
              />
              <span>{{ COMMON.TO_ADD_GG_CAL }}</span> <br>
              <p v-text="COMMON.IF_NOT_WORKING_PLZ_CLEAR_CACHE" />
            </div>
          </div>
          <p
            v-if="scheduleList.length === 0"
            class="ml-4 color-info"
          >{{ COMMON.NO_DATA }}</p>

        </article>

        <article>
          <h5>{{ COMMON.INTRODUCTION }}</h5>
          <p class="small-font-size">{{ program.description }}</p>
        </article>
      </el-card>
      <el-card shadow="never" />
    </section>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { parseVNTime } from '@/assets/utils/index'
import { FB, COMMON } from '@/assets/utils/constant'
import { categoryTagMap } from '@/assets/utils/constant'

export default {
  filters: {
    parseTime(time) {
      return parseVNTime(time, '{d}/{m}/{y} {H}:{i}', true, true)
    }
  },
  asyncData({ store, params }) {
    const now = new Date()
    const before30Mins = Date.parse(now) - 30 * 60 * 1000
    const programId = params.id.split('_').pop().trim()

    const schedulePromise = FB.scheduleRef.where('programId', '==', programId)
      .where('startTime', '>=', FB.timestamp.fromMillis(before30Mins))
      .orderBy('startTime', 'asc').get()
    const programPromise = store.dispatch('app/fetchProgram', { programId })
    return Promise.all([schedulePromise, programPromise]).then(results => {
      const scheduleListDoc = results[0]
      const scheduleList = []
      const program = results[1]
      scheduleListDoc.forEach(doc => {
        const schedule = { ...doc.data(), id: doc.id }
        scheduleList.push(schedule)
      })
      return { scheduleList, program }
    })
  },
  data() {
    return {
      program: null,
      programId: null,
      scheduleList: null,
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
      nextDaysProgramList: 'nextDaysProgramList'
    })
  },
  watch: {
  },
  created() {
  },
  methods: {
    fetchScheduleList() {
      const now = new Date()
      this.$store.dispatch('app/fetchScheduleList',
        { programId: this.programId, startTime: now, orderBy: ['startTime', 'asc'] }).then(list => {
        list.forEach(schedule => {
          schedule.channel = this.channelList.find(item => item.id === schedule.channelId)
        })
        this.scheduleList = list
      })
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
  head: {
    title: `Truyền hình 24h - ${COMMON.PROGRAM_DETAIL}`,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Giới thiệu chi tiết, đầy đủ các chương trình truyền hình được phát sóng hàng ngày trên các kênh HBO, Cinemax, AXN, Fox Movies, Red By HBO, Discovery, ...' }
    ]
  }
}
</script>
