<template>
  <div>
    <el-table :data="scheduleList" border stripe style="width: 100%" size="small">
      <el-table-column
        label="Start"
        width="75"
      >
        <template slot-scope="{row}">
          <div>{{ parseVNTime(row.startTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="End"
        width="75"
      >
        <template slot-scope="{row}">
          <div>{{ parseVNTime(row.endTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="Program"
      >
        <template slot-scope="{row}">
          <el-link
            v-if="row.programId"
            :underline="false"
            class="break-word"
            @click="moveToProgramDetail(row.programId)"
          >{{ row.programName }}</el-link>
          <span v-else>{{ row.programName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Categories"
        width="300"
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
        width="220"
      >
        <template slot="header">
          <el-button
            v-if="!draft"
            type="primary"
            plain
            size="small"
            @click="handleCreateSchedule"
          >Create</el-button>
          <el-button
            v-if="!draft"
            type="success"
            size="small"
            @click="handleImportSchedule"
          >Import</el-button>

        </template>
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleScheduleEditClick(scope.row)"
          >Edit</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleScheduleDeleteClick(scope.row,scope.$index)"
          >Delete</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog
      :title="schedule.id? 'Update Schedule': 'Create Schedule'"
      :visible.sync="createScheduleDialogVisibleProp"
      width="60%"
      @close="handleDialogClose"
    >
      <CreateSchedule
        :schedule-prop="schedule"
        :draft="draft"
        @saved="handleSaved"
        @confirmed="handleConfirmData"
      />
    </el-dialog>

  </div>
</template>
<script>
import CreateSchedule from '@/components/schedules/CreateSchedule'
import { parseVNTime } from '@/assets/utils/index'
import { FB } from '@/assets/utils/constant'
import { Schedule } from '@/assets/model/Schedule'

export default {
  components: { CreateSchedule },
  props: {
    scheduleList: {
      required: true,
      type: Array
    },
    channelProp: {
      required: true,
      type: Object
    },
    draft: {
      required: false,
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      createScheduleDialogVisibleProp: false,
      schedule: null,
      scheduleInit: new Schedule()
    }
  },
  computed: {
  },
  created() {
    this.scheduleInit.channelId = Number(this.$route.params.id)
    this.scheduleInit.channelName = this.channelProp.name
    this.schedule = { ...this.scheduleInit }
  },
  methods: {
    handleCreateSchedule() {
      this.createScheduleDialogVisibleProp = true
    },
    parseVNTime(time) {
      return parseVNTime(time, '{H}:{i}', true, true)
    },
    handleSaved() {
      this.createScheduleDialogVisibleProp = false
      this.schedule = { ...this.scheduleInit }
      this.$emit('changed')
    },
    handleScheduleEditClick(row) {
      this.schedule = row
      this.createScheduleDialogVisibleProp = true
    },
    handleScheduleDeleteClick(row, index) {
      if (!this.draft) {
        this.$confirm('Delete this schedule?', 'Delete', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'error'
        }).then(() => {
          this.$store.dispatch('app/deleteSchedules', { scheduleIds: [row.id] }).then(() => {
            this.$notify({
              title: 'Schedule Deleted',
              type: 'success',
              duration: '4500',
              position: 'bottom-right'
            })
            this.$emit('changed')
          })
        })
      } else {
        this.scheduleList.splice(index, 1)
      }
    },
    handleDialogClose() {
      this.schedule = { ...this.scheduleInit }
    },
    moveToProgramDetail(programId) {
      this.$router.push(`/programs/edit/${programId}`)
    },
    handleImportSchedule() {
      this.$router.push(`/channels/manage/import/${this.$route.params.id}`)
    },
    handleConfirmData(schedule) {
      const foundIndex = this.scheduleList.findIndex(item =>
        item.startTime.seconds === Date.parse(schedule.startTime) / 1000)
      const found = this.scheduleList[foundIndex]
      if (found) {
        found.programName = schedule.programName
        found.programId = schedule.programId
        found.categories = schedule.categories
        found.endTime = FB.timestamp.fromDate(schedule.endTime)
      }
      this.$set(this.scheduleList, foundIndex, { ...found })
      this.createScheduleDialogVisibleProp = false
    }
  }
}
</script>
