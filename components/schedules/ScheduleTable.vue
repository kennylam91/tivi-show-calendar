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
        label="Program"
      >
        <template slot-scope="{row}">
          <el-link :underline="false" @click="moveToProgramDetail(row.programId)">{{ row.programName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="Category"
      >
        <template slot-scope="{row}">
          <div>{{ row.category | getCategory }}</div>
        </template>
      </el-table-column>
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
import { firebase } from '../../MyFireBase'
import { parseVNTime } from '@/assets/utils/index'

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
      this.$emit('changed')
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
        this.$store.dispatch('app/deleteSchedule', { scheduleId: row.id }).then(() => {
          this.$notify({
            title: 'Schedule Deleted',
            type: 'success',
            duration: '4500',
            position: 'top-right'
          })
          this.$emit('changed')
        })
      })
    },
    handleDialogClose() {
      this.schedule = { ...this.scheduleInit }
    },
    moveToProgramDetail(programId) {
      this.$router.push(`/programs/edit/${programId}`)
    }
  }
}
</script>
