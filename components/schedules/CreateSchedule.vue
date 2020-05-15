<template>
  <div v-loading="loadingStore">
    <div class="bold mb-2">{{ title }}</div>
    <el-form schedule-ref="scheduleCreateForm" :model="scheduleData" label-width="100px" style="width: 100%;">
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
        <el-button v-if="!draft" type="primary" @click="onSubmit">Submit</el-button>
        <el-button type="info" @click="handleConfirm">Confirm</el-button>

      </el-form-item>

    </el-form>

  </div>
</template>
<script>
import { firebase } from '@/MyFireBase'
import { FB } from '@/assets/utils/constant'
import { getStartOfDayInGMT7 } from '@/assets/utils/index'
import { Program } from '@/assets/model/Program'
import { mapGetters } from 'vuex'

export default {
  props: {
    scheduleProp: {
      required: true,
      type: Object
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
      scheduleData: null,
      scheduleRef: firebase.firestore().collection('schedules'),
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
        if (this.scheduleProp.startTime) {
          this.scheduleData.startTime = new Date(this.scheduleProp.startTime.seconds * 1000)
        }
        if (this.scheduleProp.endTime) {
          this.scheduleData.endTime = new Date(this.scheduleProp.endTime.seconds * 1000)
        }
        if (this.scheduleData.programId) {
          this.programName = this.scheduleData.programName
        } else {
          this.programName = ''
        }
      }
    },
    programName() {
      if (this.programName) {
        this.selectedProgram = this.programList.find(pro =>
          pro.name === this.programName)
        if (this.selectedProgram) {
          this.scheduleData.programId = this.selectedProgram.id
        }
      }
    },
    programList: {
      deep: true,
      handler() {
        if (this.scheduleData.programId) {
          this.programName = this.programList.find(pro =>
            pro.id === this.scheduleData.programId).name
        }
      }
    }
  },
  created() {
    FB.programRef.where('channels', 'array-contains', this.scheduleData.channelId).onSnapshot(snapshot => {
      const list = []
      snapshot.forEach(doc => {
        const program = Program.getInstanceFromDoc(doc)
        list.push(program)
      })
      this.programList = [...list]
      if (this.scheduleData.programId) {
        this.programName = this.programList.find(pro =>
          pro.id === this.scheduleData.programId).name
      }
    })
  },
  methods: {
    onSubmit() {
      const id = this.scheduleData.id
      this.validateSchedule(this.scheduleData).then(() => {
        this.scheduleData.channelName = this.channelProp.name
        this.scheduleData.programName = this.selectedProgram.name
        this.scheduleData.categories = this.selectedProgram.categories
        this.$store.dispatch('app/setLoading', true)
        if (!id) {
          this.$store.dispatch('app/createSchedule', this.scheduleData).then(() => {
            const startTime = this.scheduleData.startTime
            const startOfDateInGMT7 = getStartOfDayInGMT7(startTime)
            FB.programRef.doc(this.selectedProgram.id).update({
              schedules: firebase.firestore.FieldValue.arrayUnion(startOfDateInGMT7)
            })
            this.$notify({
              title: 'Schedule Created',
              type: 'success',
              duration: '4500',
              position: 'bottom-right',
              top: '100'
            })
            this.$emit('saved')
          }).catch(err => {
            console.log(err)
          }).finally(() => this.$store.dispatch('app/setLoading', false))
        } else {
          this.$store.dispatch('app/updateSchedule', this.scheduleData).then(() => {
            const startTime = this.scheduleData.startTime
            const startOfDateInGMT7 = getStartOfDayInGMT7(startTime)
            FB.programRef.doc(this.selectedProgram.id).update({
              schedules: firebase.firestore.FieldValue.arrayUnion(startOfDateInGMT7)
            })
            this.$notify({
              title: 'Schedule Updated',
              type: 'success',
              duration: '4500',
              position: 'bottom-right'
            })
            this.$emit('saved')
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.$store.dispatch('app/setLoading', false)
          })
        }
      }).catch((err) => {
        this.$message({
          message: err,
          type: 'error',
          showClose: true,
          offset: '100'
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
    validateSchedule(schedule) {
      return new Promise((resolve, reject) => {
        if (schedule.endTime <= schedule.startTime) {
          reject('EndTime must be after StartTime')
        }

        const previousScheduleQuery = this.scheduleRef
          .where('channelId', '==', schedule.channelId)
          .where('startTime', '<', schedule.startTime)
          .orderBy('startTime', 'desc')
          .limit(1)
        previousScheduleQuery.onSnapshot((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((foundSchedule) => {
              // compare schedule startTime after foundSchedule endTime, if true: valid, else inValid
              if (Date.parse(schedule.startTime) < foundSchedule.data().endTime.seconds * 1000) {
                reject('Invalid StartTime')
              } else {
                const nextScheduleQuery = this.scheduleRef
                  .where('channelId', '==', schedule.channelId)
                  .where('startTime', '>', schedule.startTime)
                  .orderBy('startTime')
                  .limit(1)
                nextScheduleQuery.onSnapshot((querySnapshot) => {
                  if (!querySnapshot.empty) {
                    querySnapshot.forEach((foundSchedule) => {
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
            const nextScheduleQuery = this.scheduleRef
              .where('channelId', '==', schedule.channelId)
              .where('startTime', '>', schedule.startTime)
              .orderBy('startTime')
              .limit(1)
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
