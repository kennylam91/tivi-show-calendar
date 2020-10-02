<template>
  <div>
    <table class="table table-hover table-bordered small-font-size ">
      <tr class="color-info text-center">
        <th scope="col">{{ COMMON.NAME }}</th>
        <th v-if="!isAdmin" scope="col">{{ COMMON.DESCRIPTION }}</th>
        <th v-if="isAdmin">{{ parseToDate(today) }}</th>
        <th v-if="isAdmin">{{ parseToDate(tomorrow) }}</th>
        <th v-if="isAdmin">{{ parseToDate(next2Days) }}</th>
        <th v-if="isAdmin">{{ COMMON.ACTION }}</th>
      </tr>
      <tbody>
        <tr
          v-for="(channel, index) in channelData"
          :key="index"
          class="text-center"
        >
          <td>
            <el-link class="mb-2" @click="handleNameClick(channel)">
              <h6 class="channelNameLink">{{ channel.name }}</h6>
            </el-link>
            <div v-if="isAdmin">
              <el-switch
                v-model="channel.vip"
                :active-text="COMMON.SHOW"
                :inactive-text="COMMON.HIDE"
                @change="handleVipChange(channel)"
              />
            </div>
          </td>
          <td v-if="!isAdmin">{{ channel.description }}</td>
          <td
            v-if="isAdmin"
            :class="getTextColorClass(isChannelScheduled(channel, today))"
          >{{ isChannelScheduled(channel, today) }}</td>
          <td
            v-if="isAdmin"
            :class="getTextColorClass(isChannelScheduled(channel, tomorrow))"
          >{{ isChannelScheduled(channel, tomorrow) }}</td>
          <td
            v-if="isAdmin"
            :class="getTextColorClass(isChannelScheduled(channel, next2Days))"
          >{{ isChannelScheduled(channel, next2Days) }}</td>

          <td v-if="isAdmin" align="center" width="300">
            <el-button-group class="mb-2 d-block">
              <el-button
                type="success"
                size="mini"
                style="width: 120px;"
                @click="moveToChannelManageView(channel)"
              >{{ COMMON.SCHEDULE }}</el-button>
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
            <el-button-group class="d-block">
              <el-button
                size="mini"
                type="warning"
                style="width: 100px;"
                @click="$router.push({path: `/programs?channelId=${channel.id}`})"
              >
                Programs
              </el-button>

              <el-button
                type="primary"
                size="mini"
                style="width: 100px;"
                @click="handleImportSchedule(channel)"
              >Import</el-button>
            </el-button-group>

          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
<script>
import { parseVNTime } from '@/assets/utils/index'
// import { getStartOfDate, getEndOfDate } from '@/assets/utils/index'
import { getStartOfDayInGMT7 } from '@/assets/utils/index'
// import { FB } from '@/assets/utils/constant'

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
      tomorrow: new Date((new Date()).getTime() + (24 * 60 * 60 * 1000)),
      next2Days: new Date((new Date()).getTime() + (2 * 24 * 60 * 60 * 1000))

    }
  },
  computed: {
    startOfTodayInGMT7() {
      return getStartOfDayInGMT7(this.today)
    }
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
        this.$store.dispatch('app/deleteChannel', { channelIds: [row.id] }).then(() => {
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
    isChannelScheduled(channel, date) {
      const schedules = channel.schedules
      if (schedules) {
        const startDateInGMT7 = getStartOfDayInGMT7(date)
        return schedules.includes(startDateInGMT7)
      } else {
        return false
      }
    },
    handleImportSchedule(channel) {
      this.$router.push(`/channels/manage/import/${channel.id}`)
    }
  }
}
</script>
