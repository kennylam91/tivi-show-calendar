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
        <el-autocomplete
          v-model="programName"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="Please Input"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <div class="value">{{ item.name }}</div>
          </template>
        </el-autocomplete>

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
      }
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
  },
  methods: {
    onSubmit() {
      console.log('onSubmit')
      if (!this.scheduleData.id) {
        this.scheduleRef.add(this.scheduleData).then(scheduleRef => {
          console.log('add schedule success')
          this.$emit('saved')
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.scheduleRef.doc(this.scheduleData.id).set(this.scheduleData).then(() => {
          console.log('update schedule ok')
          this.$emit('saved')
        }).catch(err => {
          console.log(err)
        })
      }
    },
    querySearch(queryString, cb) {
      var results = queryString ? this.programList.filter(this.createFilter(queryString)) : this.programList
      // call callback function to return suggestions
      cb(results)
    },
    createFilter(queryString) {
      return (program) => {
        return (program.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
      console.log(item)
      this.scheduleData.programId = item.id
      this.programName = item.name
    }
  }
}
</script>
