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
          :disabled="scheduleData.programId !== null"
        />
      </el-form-item>
      <el-form-item label="Program">
        <el-select
          ref="programSelectRef"
          v-model="selectedProgram"
          style="width: 100%;"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="Please enter a keyword"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="onSelectChange"
        >
          <el-option
            v-for="item in scheduleProp.programOptions"
            :key="item.id"
            :label="item.enName"
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
        // truong hop edit
        if (this.scheduleProp.programId) {
          this.$store.dispatch('app/fetchProgram', this.scheduleProp.programId)
            .then(res => {
              this.selectedProgram = res
              this.scheduleProp.programOptions = [res]
            })
        // import schedule => click edit
        } else if (this.scheduleProp.programName && !this.scheduleProp.programOptions) {
          const data = { searchName: this.scheduleProp.enName ? this.scheduleProp.enName
            : this.scheduleProp.viName }
          if (data.searchName) {
            this.$store.dispatch('app/searchProgram', data).then(res => {
              this.scheduleProp.programOptions = res.content
            })
          }
        }
        setTimeout(() => {
          if (this.$refs.programSelectRef) {
            this.$refs.programSelectRef.focus()
          }
        }, 200)
      }
    }
    // selectedProgram: {
    //   deep: true,
    //   handler() {
    //     debugger
    //     this.scheduleData.programId = this.selectedProgram.id
    //     this.scheduleData.programName = this.selectedProgram.name
    //   }
    // }
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
      if (query && query.length > 1) {
        this.loading = true
        this.$store.dispatch('app/searchProgram', { searchName: query }).then(res => {
          this.scheduleProp.programOptions = res.content
          this.loading = false
        })
      } else {
        this.scheduleProp.programOptions = []
      }
    },
    validateSchedule(schedule) {
      return new Promise((resolve, reject) => {
        if (schedule.endTime <= schedule.startTime) {
          reject('EndTime must be after StartTime')
        }
        resolve()
      })
    },
    handleConfirm() {
      this.scheduleData.programName = this.selectedProgram.name
      this.scheduleData.programId = this.selectedProgram.id
      this.$emit('confirmed', this.scheduleData)
    },
    onSelectChange() {
      this.scheduleData.programId = this.selectedProgram.id
      this.scheduleData.programName = this.selectedProgram.name
    }
  }
}
</script>
