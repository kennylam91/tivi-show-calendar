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
        prop="programId"
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
    >
      <CreateSchedule :schedule-prop="newSchedule" @saved="handleSaved" />
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
      newSchedule: null,
      newScheduleInit: {
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
    this.newScheduleInit.channelId = this.$route.params.id
    this.newSchedule = { ...this.newScheduleInit }
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
      this.newSchedule = { ...this.newScheduleInit }
    }
  }
}
</script>
