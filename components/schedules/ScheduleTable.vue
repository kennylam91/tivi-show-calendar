<template>
  <div>
    <el-table :data="scheduleList" border stripe style="width: 100%" size="small">
      <el-table-column
        label="Start Time"
      >
        <template slot-scope="{row}">
          <div>{{ parseVNTime(row.startTime.seconds) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="End Time"
      >
        <template slot-scope="{row}">
          <div>{{ parseVNTime(row.endTime.seconds) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="programName"
        label="program"
      />
      <el-table-column
        align="center"
        width="180"
      >
        <template slot="header">
          <el-button type="primary" plain size="small" @click="handleCreateSchedule">Create Schedule</el-button>

        </template>
        <template slot-scope="scope">
          <el-button size="small" @click="handleScheduleEditClick(scope.row)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleScheduleDeleteClick(scope.row)">Delete</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog
      v-if="createScheduleDialogVisibleProp"
      title="Create Schedule"
      :visible.sync="createScheduleDialogVisibleProp"
      width="60%"
      @close="handleDialogClose"
    >
      <CreateSchedule :schedule-prop="schedule" @saved="handleSaved" />
    </el-dialog>

  </div>
</template>
<script>
import CreateSchedule from '@/components/schedules/Create'
import { firebase } from '../../FireBase'
import { parseVNTime } from '@/utils/index'

export default {
  components: { CreateSchedule },
  props: {
    scheduleList: {
      required: true,
      type: Array
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
      },
      scheduleRef: firebase.firestore().collection('schedules')
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
      console.log('handleCreateSchedule')
      this.createScheduleDialogVisibleProp = true
    },
    parseVNTime(time) {
      return parseVNTime(time, '{d}/{m}/{y} {h}:{i}{a}', true, true)
    },
    handleSaved() {
      this.createScheduleDialogVisibleProp = false
      this.schedule = { ...this.scheduleInit }
    },
    handleScheduleEditClick(row) {
      this.schedule = row
      this.createScheduleDialogVisibleProp = true
    },
    handleScheduleDeleteClick(row) {
      this.$confirm('Delete this schedule?', 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'error'
      }).then(() => {
        this.scheduleRef.doc(row.id).delete().then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed'
          })
        })
      })
    },
    handleDialogClose() {
      this.schedule = { ...this.scheduleInit }
    }
  }
}
</script>
