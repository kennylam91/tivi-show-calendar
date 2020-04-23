<template>
  <div>
    <div class="bold mb-2">{{ title }}</div>
    <el-form schedule-ref="scheduleCreateForm" :model="scheduleData" label-width="100px" style="width: 100%;">
      <el-form-item label="Start time">
        <el-date-picker
          v-model="scheduleData.startTime"
          style="width: 100%;"
          type="datetime"
          placeholder="Select date and time"
        />
      </el-form-item>
      <el-form-item label="End time">
        <el-date-picker
          v-model="scheduleData.endTime"
          style="width: 100%;"
          type="datetime"
          placeholder="Select date and time"
        />
      </el-form-item>
      <el-form-item label="Program">
        <el-select
          v-model="programName"
          style="width: 100%;"
          filterable
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
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>
import { firebase } from '../../MyFireBase'
import { mapGetters } from 'vuex'

export default {
  props: {
    scheduleProp: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      scheduleData: null,
      scheduleRef: firebase.firestore().collection('schedules'),
      programList: [],
      channelId: null,
      options: [],
      value: [],
      loading: false,
      programName: null
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
      programList: 'programList'
    })
  },
  watch: {
    scheduleProp: {
      immediate: true,
      handler() {
        this.scheduleData = { ...this.scheduleProp }
        if (this.scheduleProp.startTime) {
          this.scheduleData.startTime = new Date(this.scheduleProp.startTime.seconds * 1000)
        }
        if (this.scheduleProp.endTime) {
          this.scheduleData.endTime = new Date(this.scheduleProp.endTime.seconds * 1000)
        }
      }
    },
    programName() {
      this.scheduleData.programId = this.programList.find(pro => pro.name === this.programName).id
    }
  },
  created() {
    if (this.programList) {
      this.$store.dispatch('app/fetchProgramList', {}).then(list => {
        this.programList = list
        if (this.scheduleData.programId) {
          this.programName = this.programList.find(pro => pro.id === this.scheduleData.programId).name
        }
      })
    } else {
      if (this.scheduleData.programId) {
        this.programName = this.programList.find(pro => pro.id === this.scheduleData.programId).name
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('onSubmit')
      const id = this.scheduleData.id
      this.validateSchedule(this.scheduleData).then(() => {
        this.removeProperty(this.scheduleData)
        if (!id) {
          this.$store.dispatch('app/createSchedule', this.scheduleData).then(() => {
            console.log('add schedule success')
            this.$notify({
              title: 'Schedule Created',
              type: 'success',
              duration: '4500',
              position: 'top-right'
            })

            this.$emit('saved')
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$store.dispatch('app/updateSchedule', this.scheduleData).then(() => {
            console.log('update schedule ok')
            this.$notify({
              title: 'Schedule Updated',
              type: 'success',
              duration: '4500',
              position: 'top-right'
            })
            this.$emit('saved')
          }).catch(err => {
            console.log(err)
          })
        }
      }).catch((err) => {
        this.$message({
          message: err,
          type: 'error',
          showClose: true
        })
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.programList.filter(item => {
            return item.name.toLowerCase()
              .indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    removeProperty(object) {
      for (const key in object) {
        if (!['startTime', 'endTime', 'channelId', 'programId'].includes(key)) {
          delete object[key]
        }
      }
    },
    validateSchedule(schedule) {
      return new Promise((resolve, reject) => {
        if (schedule.endTime <= schedule.startTime) {
          reject('EndTime must be after StartTime')
        }

        const previousScheduleQuery = this.scheduleRef.where('channelId', '==', schedule.channelId).where('startTime', '<', schedule.startTime).orderBy('startTime', 'desc').limit(1)
        previousScheduleQuery.onSnapshot((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((foundSchedule) => {
              console.log(foundSchedule)
              console.log(foundSchedule.data())
              // compare schedule startTime after foundSchedule endTime, if true: valid, else inValid
              if (Date.parse(schedule.startTime) < foundSchedule.data().endTime.seconds * 1000) {
                reject('Invalid StartTime')
              } else {
                const nextScheduleQuery = this.scheduleRef.where('channelId', '==', schedule.channelId).where('startTime', '>', schedule.startTime).orderBy('startTime').limit(1)
                nextScheduleQuery.onSnapshot((querySnapshot) => {
                  if (!querySnapshot.empty) {
                    querySnapshot.forEach((foundSchedule) => {
                      console.log(foundSchedule.data())
                      if (Date.parse(schedule.endTime) > foundSchedule.data().startTime.seconds * 1000) {
                        reject('Invalid EndTime')
                      } else {
                        resolve()
                      }
                    })
                  } else {
                    resolve()
                  }
                })
              }
            })
          } else {
            const nextScheduleQuery = this.scheduleRef.where('channelId', '==', schedule.channelId).where('startTime', '>', schedule.startTime).orderBy('startTime').limit(1)
            nextScheduleQuery.onSnapshot((querySnapshot) => {
              if (!querySnapshot.empty) {
                querySnapshot.forEach((foundSchedule) => {
                  console.log(foundSchedule.data())
                  if (Date.parse(schedule.endTime) > foundSchedule.data().startTime.seconds * 1000) {
                    reject('Invalid EndTime')
                  } else {
                    resolve()
                  }
                })
              } else {
                resolve()
              }
            })
          }
        })
      })
    }

  }
}
</script>
