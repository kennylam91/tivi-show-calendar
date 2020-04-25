<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ COMMON.TODAY_PROGRAM }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card v-if="todayProgramList" :body-style="{ padding: '0px' }">
      <div slot="header">
        <span class="bold color-primary">{{ COMMON.TODAY_PROGRAM }}</span>
      </div>
      <el-form
        ref="programSearchForm"
        size="small"
        :inline="true"
        :model="programSearchForm"
        class="m-2"
        label-width="80px"
      >
        <el-form-item :label="COMMON.SEARCH">
          <el-input
            v-model="programSearchForm.name"
            :placeholder="COMMON.INPUT_PROGRAM_NAME"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item :label="COMMON.CHANNEL">
          <el-select
            v-model="programSearchForm.channels"
            multiple
            size="small"
            :placeholder="COMMON.SELECT_CHANNEL"
            style="width: 200px"
            @change="searchProgram"
          >
            <el-option
              v-for="channel in channelList"
              :key="channel.id"
              :label="channel.name"
              :value="channel.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="COMMON.CATEGORY">
          <el-select
            v-model="programSearchForm.categories"
            multiple
            size="small"
            :placeholder="COMMON.SELECT_CATEGORY"
            style="width: 200px"
            @change="searchProgram"
          >
            <el-option
              v-for="item in CATEGORIES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

      </el-form>

      <div class="row" style="margin: 0">
        <div
          v-for="program in programData"
          :key="program.id"
          class="col-sm-4 col-md-3 col-lg-2 col-6 my-2 px-1"
        >
          <Program :program="program" />
        </div></div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Program from '@/components/programs/Program'

export default {
  components: { Program },
  data() {
    return {
      programSearchForm: {
        name: '',
        channels: [],
        categories: []
      },
      programData: null
    }
  },
  computed: {
    ...mapGetters({
      programList: 'programList',
      todayProgramList: 'todayProgramList',
      channelList: 'channelList',
      todayScheduleList: 'todayScheduleList'
    })
  },
  watch: {
    programList: {
      immediate: true,
      handler() {
        if (!this.programList) {
          this.$store.dispatch('app/fetchProgramList', {})
        } else {
          if (!this.todayProgramList) {
            this.updateTodayProgramList()
          }
        }
      }
    },
    todayProgramList: {
      immediate: true,
      handler() {
        if (this.todayProgramList) {
          this.searchProgram()
        }
      }
    }
  },
  created() {
  },
  methods: {
    searchProgram() {
      this.programData = []
      if (this.programSearchForm.categories.length > 0) {
        this.programData = this.todayProgramList.filter(this.filterByCategory)
      }
      if (this.programSearchForm.channels.length > 0) {
        // get channels of program in todayProgramList
        for (const program of this.todayProgramList) {
          program.channels = []
          for (const schedule of this.todayScheduleList) {
            if (schedule.programId === program.id && !program.channels.includes(schedule.channelId)) {
              program.channels.push(schedule.channelId)
            }
          }
        }

        this.programData = this.programData.filter(this.filterByChannel)
      } else {
        this.programData = this.todayProgramList
      }
    },
    filterByCategory(program) {
      if (this.programSearchForm.categories.length > 0) {
        return this.isTwoArrayHaveSameElement(program.categories, this.programSearchForm.categories)
      }
      return true
    },
    filterByChannel(program) {
      return this.isTwoArrayHaveSameElement(program.channels, this.programSearchForm.channels)
    },
    isTwoArrayHaveSameElement(first, second) {
      if (!first || !second) {
        return false
      } else {
        if (!first.length || !second.length) {
          return false
        } else {
          for (const i of first) {
            for (const j of second) {
              if (i === j) {
                return true
              }
            }
          }
          return false
        }
      }
    }
  }

}
</script>
