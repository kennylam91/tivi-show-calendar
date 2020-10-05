<template>
  <div v-loading="loadingStore">
    <div class="bold mb-2">{{ title }}</div>
    <el-form schedule-ref="scheduleCreateForm" :model="scheduleData" label-width="120px" style="width: 100%;">
      <el-form-item label="Start time">
        <el-date-picker
          v-model="scheduleData.startTime"
          style="width: 100%;"
          type="datetime"
          placeholder="Select date and time"
          format="yyyy-MM-dd HH:mm"
        />
      </el-form-item>
      <el-form-item label="End time">
        <el-date-picker
          v-model="scheduleData.endTime"
          style="width: 100%;"
          type="datetime"
          placeholder="Select date and time"
          format="yyyy-MM-dd HH:mm"
        />
      </el-form-item>
      <el-form-item label="Program Name" size="normal">
        <el-input
          v-model="scheduleData.programName"
          size="normal"
          clearable
          :disabled="scheduleData.programId"
        />
      </el-form-item>
      <el-form-item label="Program">
        <el-select
          v-model="selectedProgram"
          style="width: 100%;"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="Please enter a keyword"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-if="!draft" type="primary" @click="onSubmit">Submit</el-button>
        <el-button v-if="draft" type="info" @click="handleConfirm">Confirm</el-button>

      </el-form-item>

    </el-form>

  </div>
</template>
<script>
// import { getStartOfDayInGMT7 } from '@/assets/utils/index'
import { mapGetters } from 'vuex'

export default {
  props: {
    scheduleProp: {
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
      scheduleData: null,
      channelId: null,
      options: [],
      value: [],
      loading: false,
      programName: null,
      programList: null,
      selectedProgram: null
    }
  },
  computed: {
    title() {
      if (this.scheduleProp.id) {
        return 'Update schedule'
      } else {
        return 'Create schedule'
      }
    },
    ...mapGetters({
      loadingStore: 'loading'
    })
  },
  watch: {
    scheduleProp: {
      immediate: true,
      deep: true,
      handler() {
        this.scheduleData = { ...this.scheduleProp }
        if (this.scheduleProp.programId) {
          this.$store.dispatch('app/fetchProgram', this.scheduleProp.programId)
            .then(res => {
              this.selectedProgram = res
              this.options = [res]
            })
        }
      }
    },
    selectedProgram: {
      deep: true,
      handler() {
        this.scheduleData.programId = this.selectedProgram.id
        this.scheduleData.programName = this.selectedProgram.name
      }
    }
  },
  created() {
  },
  methods: {
    onSubmit() {
      this.validateSchedule(this.scheduleData).then(() => {
        this.$store.dispatch('app/createOrUpdateSchedule', this.scheduleData).then(() => {
          this.$notify({
            title: 'Schedule Saved',
            type: 'success',
            duration: '4500',
            position: 'bottom-right',
            top: '100'
          })
          this.$emit('saved')
        })
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        this.$store.dispatch('app/searchProgram', { searchName: query }).then(res => {
          this.options = res.content
          this.loading = false
        })
      } else {
        this.options = []
      }
    },
    validateSchedule(schedule) {
      return new Promise((resolve, reject) => {
        if (schedule.endTime <= schedule.startTime) {
          reject('EndTime must be after StartTime')
        }
        resolve()

        // const previousScheduleQuery = this.scheduleRef
        //   .where('channelId', '==', schedule.channelId)
        //   .where('startTime', '<', schedule.startTime)
        //   .orderBy('startTime', 'desc')
        //   .limit(1)
        // previousScheduleQuery.onSnapshot((querySnapshot) => {
        //   if (!querySnapshot.empty) {
        //     querySnapshot.forEach((foundSchedule) => {
        //       // compare schedule startTime after foundSchedule endTime, if true: valid, else inValid
        //       if (Date.parse(schedule.startTime) < foundSchedule.data().endTime.seconds * 1000) {
        //         reject('Invalid StartTime')
        //       } else {
        //         const nextScheduleQuery = this.scheduleRef
        //           .where('channelId', '==', schedule.channelId)
        //           .where('startTime', '>', schedule.startTime)
        //           .orderBy('startTime')
        //           .limit(1)
        //         nextScheduleQuery.onSnapshot((querySnapshot) => {
        //           if (!querySnapshot.empty) {
        //             querySnapshot.forEach((foundSchedule) => {
        //               if (Date.parse(schedule.endTime) > foundSchedule.data().startTime.seconds * 1000) {
        //                 reject('Invalid EndTime')
        //               } else {
        //                 resolve()
        //               }
        //             })
        //           } else {
        //             resolve()
        //           }
        //         })
        //       }
        //     })
        //   } else {
        //     const nextScheduleQuery = this.scheduleRef
        //       .where('channelId', '==', schedule.channelId)
        //       .where('startTime', '>', schedule.startTime)
        //       .orderBy('startTime')
        //       .limit(1)
        //     nextScheduleQuery.onSnapshot((querySnapshot) => {
        //       if (!querySnapshot.empty) {
        //         querySnapshot.forEach((foundSchedule) => {
        //           console.log(foundSchedule.data())
        //           if (Date.parse(schedule.endTime) > foundSchedule.data().startTime.seconds * 1000) {
        //             reject('Invalid EndTime')
        //           } else {
        //             resolve()
        //           }
        //         })
        //       } else {
        //         resolve()
        //       }
        //     })
        //   }
        // })
      })
    },
    handleConfirm() {
      this.scheduleData.programName = this.selectedProgram.name
      this.scheduleData.programId = this.selectedProgram.id
      this.scheduleData.categories = this.selectedProgram.categories
      this.$emit('confirmed', this.scheduleData)
    }

  }
}
</script>
