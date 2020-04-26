<template>
  <div v-if="channel">
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/danh-sach-kenh' }">{{ COMMON.CHANNEL_LIST }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ channel.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card :body-style="{ padding: '10px' }">
      <div class="row">
        <div
          class="col-sm-4 col-md-2 text-center"
          style="padding-left: 15px;padding-right: 15px; "
        >
          <img class="img-fluid" :src="channel.logo">
        </div>
        <div
          class="col-sm-8 col-md-10 flex"
          style="padding-left: 15px;padding-right: 15px; align-items: center "
        >
          <p class="smaller-font-size">{{ channel.description }}</p>
        </div>
      </div>
      <div class="row">
        <div
          class="my-2 col-6 col-sm-6 col-md-4"
          style="padding-right: 5px; padding-left: 15px;"
        >
          <el-date-picker
            v-model="selectedDate"
            format="dd/MM/yyyy"
            size="small"
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
            size="small"
            clearable
            @change="searchProgram"
          />
        </div>
      </div>

      <el-table
        id="scheduleTable"
        :data="scheduleData"
        size="small"
        border
        stripe
        fit
        style="width: 100%"
      >
        <el-table-column
          :label="COMMON.TIME"
          align="center"
          :min-width="16"
        >
          <template slot-scope="{row}">
            <div>{{ parseTime(row.startTime.seconds) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="COMMON.PROGRAM_NAME"
          :min-width="52"
        >
          <template slot-scope="{row}">
            <el-link :underline="false" @click="viewProgramDetail(row)">
              <span class="color-primary">{{ row.programName | uppercaseFirst }}</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="COMMON.CATEGORY"
          :min-width="32"
          :filters="CATEGORIES"
          :filter-method="filterCategory"
          :filter-multiple="true"
          filter-placement="bottom"
          prop="categories"
        >
          >
          <template slot-scope="{row}">
            <el-tag
              v-for="(item, index) in row.categories"
              :key="index"
              size="small"
              effect="dark"
              type="info"
              style="margin: 2px;"
            >
              {{ item | getCategory }}
            </el-tag>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

  </div>
</template>
<script>
import { parseVNTime } from '@/assets/utils/index'
import { mapGetters } from 'vuex'

export default {
  components: { },
  data() {
    return {
      channelId: null,
      channel: null,
      scheduleList: [],
      program: null,
      detailProgramDlgVisible: false,
      selectedDate: new Date(),
      searchText: '',
      scheduleData: []
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList'
    })
  },
  watch: {
    selectedDate() {
      this.getScheduleList()
    },
    channelList: {
      immediate: true,
      deep: true,
      handler() {
        this.channelId = this.$route.params.id.split('-').pop()
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
    parseTime(time) {
      return parseVNTime(time, '{h}:{i} {a}', true, true)
    },
    getScheduleList() {
      this.fetchScheduleList(this.channelId, this.selectedDate).then(scheduleList => {
        this.scheduleList = scheduleList
        this.searchText = ''
        this.scheduleData = this.scheduleList
      })
    },
    searchProgram() {
      this.scheduleData = this.searchText
        ? this.scheduleList.filter(schedule => schedule.programName.toLowerCase().includes(this.searchText.toLowerCase()))
        : this.scheduleList
    },
    filterCategory(value, row, column) {
      debugger
      return row.categories.includes(value)
    }
  }
}
</script>
<style>
#scheduleTable .cell {
  word-break: break-word;
}
</style>

