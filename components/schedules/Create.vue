<template>
  <div>
    <div class="bold mb-2">{{ title }}</div>
    <el-form schedule-ref="scheduleCreateForm" :model="scheduleData" label-width="100px">
      <el-form-item label="Start time">
        <el-date-picker
          v-model="scheduleData.startTime"
          type="datetime"
          placeholder="Select date and time"
        />
      </el-form-item>
      <el-form-item label="End time">
        <el-date-picker
          v-model="scheduleData.endTime"
          type="datetime"
          placeholder="Select date and time"
        />
      </el-form-item>
      <el-form-item label="Program">
        <el-select
          v-model="programName"
          filterable
          remote
          reserve-keyword
          placeholder="Please enter a keyword"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
import { firebase } from '../../FireBase'
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
      programRef: firebase.firestore().collection('programs'),
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
    }
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
      debugger
      this.scheduleData.programId = this.programList.find(pro => pro.name === this.programName).id
    }
  },
  created() {
    this.programRef.onSnapshot((querySnapshot) => {
      this.programList = []
      querySnapshot.forEach((program) => {
        this.programList.push({
          id: program.id,
          name: program.data().name,
          description: program.data().description
        })
      })
    })

    this.programRef.onSnapshot((querySnapshot) => {
      this.programList = []
      querySnapshot.forEach((program) => {
        this.programList.push({
          id: program.id,
          name: program.data().name,
          description: program.data().description,
          value: program.data().name,
          label: program.data().name
        })
      })
      if (this.scheduleData.programId) {
        this.programName = this.programList.find(pro => pro.id === this.scheduleData.programId).name
      }
    })
  },
  methods: {
    onSubmit() {
      console.log('onSubmit')
      const id = this.scheduleData.id
      this.removeProperty(this.scheduleData)
      if (!id) {
        this.scheduleRef.add(this.scheduleData).then(scheduleRef => {
          console.log('add schedule success')
          this.$emit('saved')
        }).catch(err => {
          console.log(err)
        })
      } else {
        debugger
        this.scheduleRef.doc(id).set(this.scheduleData).then(() => {
          console.log('update schedule ok')
          this.$emit('saved')
        }).catch(err => {
          console.log(err)
        })
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.options = this.programList.filter(item => {
            return item.label.toLowerCase()
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
    }

  }
}
</script>
