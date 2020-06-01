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
            <div>
              <el-switch
                v-model="channel.isVip"
                :active-text="COMMON.SHOW"
                :inactive-text="COMMON.HIDE"
                @change="handleVipChange(channel)"
              />
            </div>
          </td>
          <td v-if="!isAdmin">{{ channel.description }}</td>
          <td
            v-if="isAdmin"
            :class="getTextColorClass(channel.isTodayScheduled)"
          >{{ channel.isTodayScheduled }}</td>
          <td
            v-if="isAdmin"
            :class="getTextColorClass(channel.isTomorrowScheduled)"
          >{{ channel.isTomorrowScheduled }}</td>
          <td
            v-if="isAdmin"
            :class="getTextColorClass(channel.isNext2DaysScheduled)"
          >{{ channel.isNext2DaysScheduled }}</td>

          <td v-if="isAdmin" align="center" width="270">
            <el-button-group class="mb-2 d-block">
              <el-button
                style="width: 115px;"
                size="mini"
                type="primary"
                plain
                @click="handleChannelEditClick(channel)"
              >{{ COMMON.EDIT }}</el-button>
              <el-button
                type="success"
                size="mini"
                style="width: 115px;"
                @click="moveToChannelManageView(channel)"
              >{{ COMMON.SCHEDULE }}</el-button>

            </el-button-group>
            <el-button-group class="d-block">
              <el-button
                size="mini"
                type="warning"
                style="width: 115px;"
                @click="$router.push({path: `/programs?channelId=${channel.id}`})"
              >
                Programs
              </el-button>
              <el-button
                type="danger"
                size="mini"
                style="width: 115px;"
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
import { parseVNTime, getStartOfDate, getEndOfDate } from '@/assets/utils/index'
import { FB } from '@/assets/utils/constant'

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
  },
  watch: {
    channelList: {
      immediate: true,
      deep: true,
      handler() {
        this.channelData = [...this.channelList]
        for (const channel of this.channelData) {
          this.$store.dispatch('app/fetchScheduleList',
            {
              channelId: channel.channelId,
              startTime: FB.timestamp.fromDate(getStartOfDate(this.today)),
              endTime: FB.timestamp.fromDate(getEndOfDate(this.today)),
              limit: 1
            }).then(list => {
            if (list.length > 0) {
              this.$set(channel, 'isTodayScheduled', true)
            } else {
              this.$set(channel, 'isTodayScheduled', false)
            }
          })

          this.$store.dispatch('app/fetchScheduleList',
            {
              channelId: channel.channelId,
              startTime: FB.timestamp.fromDate(getStartOfDate(this.tomorrow)),
              endTime: FB.timestamp.fromDate(getEndOfDate(this.tomorrow)),
              limit: 1
            }).then(list => {
            if (list.length > 0) {
              this.$set(channel, 'isTomorrowScheduled', true)
            } else {
              this.$set(channel, 'isTomorrowScheduled', false)
            }
          })

          this.$store.dispatch('app/fetchScheduleList',
            {
              channelId: channel.channelId,
              startTime: FB.timestamp.fromDate(getStartOfDate(this.next2Days)),
              endTime: FB.timestamp.fromDate(getEndOfDate(this.next2Days)),
              limit: 1
            }).then(list => {
            if (list.length > 0) {
              this.$set(channel, 'isNext2DaysScheduled', true)
            } else {
              this.$set(channel, 'isNext2DaysScheduled', false)
            }
          })
        }
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
        this.$store.dispatch('app/deleteChannel', { channelId: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed'
          })
          this.$store.dispatch('app/fetchChannelList')
        })
      })
    },
    handleVipChange(channel) {
      this.$store.dispatch('app/updateChannel', channel).then(() => {
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
    }
  }
}
</script>
