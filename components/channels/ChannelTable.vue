<template>
  <div :key="key" v-loading="loading">
    <table class="table table-hover table-sm table-bordered small-font-size ">
      <tr class="color-info text-center">
        <th scope="col">{{ COMMON.NAME }}</th>
        <th v-if="!isAdmin" scope="col">{{ COMMON.DESCRIPTION }}</th>
        <th v-if="isAdmin">{{ parseToDate(today) }}</th>
        <th v-if="isAdmin">{{ parseToDate(tomorrow) }}</th>
        <th v-if="isAdmin">{{ parseToDate(next2Days) }}</th>
        <th v-if="isAdmin">{{ parseToDate(next3Days) }}</th>
        <th v-if="isAdmin">{{ COMMON.ACTION }}</th>
      </tr>
      <tbody>
        <tr
          v-for="(channel, index) in channelData"
          :key="index"
          class="text-center"
        >
          <td>
            <h6 class="channelNameLink mb-0">
              <el-link class="mb-1" @click="handleNameClick(channel)">
                {{ channel.name }}
              </el-link>
              <span v-if="isAdmin">
                <el-switch
                  v-model="channel.vip"
                  @change="handleVipChange(channel)"
                />
              </span>
            </h6>

          </td>
          <td v-if="!isAdmin" class="text-left">
            <read-more
              class="read-more"
              more-str="Xem thêm"
              :text="channel.description"
              less-str="Ẩn bớt"
              :max-chars="95"
            />
          </td>
          <td
            v-if="isAdmin && scheduleStats"
            :class="getTextColorClass(getChannelScheduleTotal(channel, today))"
          >
            <span v-if="getChannelScheduleTotal(channel, today) || !channel.hasAutoImport">
              {{ getChannelScheduleTotal(channel, today) }}</span>
            <span v-else>
              <el-button
                :id="`${channel.name}-${+today}`"
                type="warning"
                size="small"
                @click="autoImport(channel, today)"
              >Fetch</el-button>
            </span>

          </td>
          <td
            v-if="isAdmin && scheduleStats"
            :class="getTextColorClass(getChannelScheduleTotal(channel, tomorrow))"
          >
            <span v-if="getChannelScheduleTotal(channel, tomorrow) || !channel.hasAutoImport">
              {{ getChannelScheduleTotal(channel, tomorrow) }}</span>
            <span v-else>
              <el-button
                :id="`${channel.name}-${+tomorrow}`"
                type="warning"
                size="small"
                @click="autoImport(channel, tomorrow)"
              >Fetch</el-button>
            </span>
          </td>
          <td
            v-if="isAdmin && scheduleStats"
            :class="getTextColorClass(getChannelScheduleTotal(channel, next2Days)) "
          >
            <span v-if="getChannelScheduleTotal(channel, next2Days) || !channel.hasAutoImport">
              {{ getChannelScheduleTotal(channel, next2Days) }}</span>
            <span v-else>
              <el-button
                :id="`${channel.name}-${+next2Days}`"
                type="warning"
                size="small"
                @click="autoImport(channel, next2Days)"
              >Fetch</el-button>
            </span>
          </td>

          <td
            v-if="isAdmin && scheduleStats"
            :class="getTextColorClass(getChannelScheduleTotal(channel, next3Days)) "
          >
            <span v-if="getChannelScheduleTotal(channel, next3Days) || !channel.hasAutoImport">
              {{ getChannelScheduleTotal(channel, next3Days) }}</span>
            <span v-else>
              <el-button
                :id="`${channel.name}-${+next3Days}`"
                type="warning"
                size="small"
                @click="autoImport(channel, next3Days)"
              >Fetch</el-button>
            </span>
          </td>

          <td v-if="isAdmin" class="text-center" align="center">
            <el-button-group class="mb-0">
              <!-- <el-button
                type="success"
                size="mini"
                style="width: 120px;"
                @click="moveToChannelManageView(channel)"
              >Manage</el-button> -->
              <el-button
                type="success"
                size="mini"
                style="width: 100px;"
                @click="handleImportSchedule(channel)"
              >Import</el-button>
              <el-button
                style="width: 70px;"
                size="mini"
                type="info"
                @click="handleChannelEditClick(channel)"
              >{{ COMMON.EDIT }}</el-button>

              <el-button
                type="danger"
                size="mini"
                style="width: 70px;"
                @click="handleChannelDeleteClick(channel)"
              >{{ COMMON.DELETE }}</el-button>
            </el-button-group>

          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
<script>
import { parseVNTime, parseTime } from '@/assets/utils/index'
import { getStartOfDayInGMT7 } from '@/assets/utils/index'
import { mapGetters } from 'vuex'
import { AutoUpdateForm } from '@/assets/model/model'

export default {
  props: {
    channelList: {
      required: true,
      type: Array
    },
    isAdmin: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      today: new Date(),
      channelData: null,
      tomorrow: new Date((+new Date()) + (24 * 60 * 60 * 1000)),
      next2Days: new Date(+new Date() + (2 * 24 * 60 * 60 * 1000)),
      next3Days: new Date(+new Date() + (3 * 24 * 60 * 60 * 1000)),
      loading: false,
      key: 0
    }
  },
  computed: {
    startOfTodayInGMT7() {
      return getStartOfDayInGMT7(this.today)
    },
    ...mapGetters({
      scheduleStats: 'scheduleStats'
    })
  },
  watch: {
    channelList: {
      immediate: true,
      deep: true,
      handler() {
        this.channelData = [...this.channelList]
      }
    }
  },
  created() {
    if (this.isAdmin && !this.scheduleStats) {
      const data = {
        startTimeFrom: this.startOfToday(),
        startTimeTo: this.startOfToday() + 4 * 24 * 60 * 60 * 1000
      }
      this.$store.dispatch('app/fetchScheduleStats', data).then(res => {
        this.$store.dispatch('app/setScheduleStats', res)
      })
    }
  },
  methods: {
    handleChannelEditClick(row) {
      this.$router.push({ path: `/channels/edit/${row.id}` })
    },
    handleChannelDeleteClick(row) {
      this.$confirm('Delete this channel?', 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('app/deleteChannels', { channelIds: [row.id] }).then(() => {
          this.$notify({
            title: 'Delete completed',
            type: 'success',
            duration: '4500',
            position: 'bottom-right'
          })
          this.$store.dispatch('app/fetchChannelList')
        })
      })
    },
    handleVipChange(channel) {
      this.$store.dispatch('app/createOrUpdateChannel', channel).then(() => {
        this.$store.dispatch('app/fetchChannelList')
      })
    },
    handleNameClick(channel) {
      if (this.isAdmin) {
        this.moveToChannelManageView(channel)
      } else {
        this.viewChannelDetail(channel)
      }
    },
    parseToDate(time) {
      return parseVNTime(time, '{d}-{m}', true, true)
    },
    getTextColorClass(boo) {
      if (boo) {
        return 'color-primary'
      } else {
        return 'color-danger'
      }
    },
    getChannelScheduleTotal(channel, date) {
      const dateStr = parseTime(date, '{Y}-{m}-{d}')
      const foundStat = this.scheduleStats.find(item => item.channelId === channel.id && item.date === dateStr)
      if (foundStat) {
        return foundStat.total
      } else {
        return null
      }
    },
    handleImportSchedule(channel) {
      this.$router.push(`/channels/manage/import/${channel.id}`)
    },
    autoImport(channel, date) {
      const rqBody = new AutoUpdateForm(channel.name, channel.id, parseTime(date, '{Y}-{m}-{d}'))
      rqBody.apiSource = channel.importSource
      this.loading = true
      this.$store.dispatch('app/autoUpdateSchedule', rqBody).then(res => {
        this.$notify({
          title: 'Update schedule completed',
          type: 'success',
          duration: '4500',
          position: 'bottom-right'
        })
        document.getElementById(channel.name + '-' + (+date)).disabled = true
        const newStats = { channelId: channel.id, date: parseTime(date, '{Y}-{m}-{d}'), total: 1 }
        this.$store.dispatch('app/updateScheduleStats', newStats)
        this.key++
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
