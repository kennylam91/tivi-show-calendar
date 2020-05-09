<template>
  <div class="py-2">

    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">{{ COMMON.DASHBOARD }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/channels' }">{{ COMMON.CHANNEL_LIST }}</el-breadcrumb-item>
        <el-breadcrumb-item>Manage channel</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="justify-between-align-center mb-2">
      <h5>Import Schedule</h5>
      <el-date-picker
        v-model="importDate"
        type="date"
        placeholder="Pick a day"
      />
    </div>
    <el-input
      v-model="scheduleInput"
      type="textarea"
      :autosize="{ minRows: 5, maxRows: 10}"
      placeholder="Please input"
      @input="handleInputChange"
    />
    <!-- <el-table :data="scheduleList" border stripe style="width: 100%" size="small">
      <el-table-column
        label="Start Time"
        width="100"
      >
        <template slot-scope="{row}">
          <div>{{ parseVNTime(row.startTime.seconds) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="End Time"
        width="100"
      >
        <template slot-scope="{row}">
          <div>{{ parseVNTime(row.endTime.seconds) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="Program"
      >
        <template slot-scope="{row}">
          <el-link
            :underline="false"
            class="break-word"
            @click="moveToProgramDetail(row.programId)"
          >{{ row.programName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="Categories"
        width="170"
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
      <el-table-column
        align="center"
        width="180"
      >
        <template slot="header">
          <el-button
            type="primary"
            plain
            size="small"
            @click="handleCreateSchedule"
          >Create</el-button>
          <el-button type="success" size="small" @click="handleImportSchedule">Import</el-button>

        </template>
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleScheduleEditClick(scope.row)"
          >Edit</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleScheduleDeleteClick(scope.row)"
          >Delete</el-button>
        </template>
      </el-table-column>

    </el-table> -->
    <ScheduleTable
      v-if="channel"
      class="my-2"
      :schedule-list="scheduleList"
      :channel-prop="channel"
      :draft="true"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScheduleTable from '@/components/schedules/ScheduleTable'
import { FB } from '@/assets/utils/constant'
export default {
  components: { ScheduleTable },
  data() {
    return {
      scheduleInput: null,
      channelId: null,
      channel: null,
      importDate: null,
      programList: null,
      scheduleList: [],
      defaultProgram: { 'logo': '',
        'description': '',
        'isNextDaysShow': true,
        'rank': 1,
        'isTodayShow': true,
        'name': 'Defaul',
        'channels': ['WnzraFRhnu1FKfeRLNCR', 'exhZ2BgF84IFzA0dONhb', 'dcBypFESR46POmThVFOq',
          'YWsE3a5hcLIAAvoNfETK', 'elFt9Fy6Dz51UPKLHhM5', 'JSVQGwve15mjQxlQhRdJ', '880MoAihKgPWbdfrNwIT',
          '4NXIQYHUSm2rdfur1Eob', 'N0gf5TR1VLlwLETqDab0', 'lcNJBsaPQ1MhYLQnyxC0', 'wELkPU0ANusKBusDba9H'],
        'id': 'FeoyRxLLN3QIkrFiFIrF',
        'categories': [] }

    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList'
    })
  },
  watch: {
    programList: {
      immediate: true,
      deep: true,
      handler() {
        if (!this.programList) {
          this.$store.dispatch('app/fetchProgramList',
            { channelId: this.$route.params.id }).then(list => {
            this.programList = [...list]
          })
        }
      }
    }
  },
  created() {
    this.channelId = this.$route.params.id
  },
  methods: {
    handleInputChange() {
      console.log('handleInputChange')
      const dataArray = this.scheduleInput.trim() ? this.scheduleInput.trim().split('\n') : []
      const scheduleArr = []
      if (this.importDate) {
        for (const schedule of dataArray) {
          const array = schedule.split(/\s+/, 2)
          const startTime = array[0]
          const timeSplitArr = startTime.split(':')
          const startTimestamp = FB.timestamp.fromMillis(this.importDate.setHours(timeSplitArr[0], timeSplitArr[1], 0, 0))

          // find program
          const program = this.programList.find(item => item.name.includes(array[1])) || this.defaultProgram
          this.channel = this.channelList.find(item => item.id === this.channelId)
          if (scheduleArr.length > 0) {
            scheduleArr[scheduleArr.length - 1].endTime = startTimestamp
          }
          const newSchedule = {
            startTime: startTimestamp,
            programName: program.name,
            categories: program.categories,
            channelId: this.channelId,
            channelName: this.channel.name,
            endTime: startTimestamp,
            programId: program.id
          }
          scheduleArr.push(newSchedule)
        }
      }
      this.scheduleList = scheduleArr
    }
  }
}
</script>
