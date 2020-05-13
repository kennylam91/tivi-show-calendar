<template>
  <div>
    <el-table :data="scheduleList" border stripe style="width: 100%" size="small">
      <el-table-column
        label="Start"
        width="75"
      >
        <template slot-scope="{row}">
          <div>{{ parseVNTime(row.startTime.seconds) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="End"
        width="75"
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
        width="200"
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
        :channel-prop="channelProp"
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
      scheduleInit: {
        startTime: null,
        endTime: null,
        programId: null,
        channelId: null
      }
    }
  },
  computed: {
  },
  created() {
    this.scheduleInit.channelId = this.$route.params.id
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
          this.$store.dispatch('app/deleteSchedule', { scheduleId: row.id }).then(() => {
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
