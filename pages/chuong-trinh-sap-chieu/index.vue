<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ COMMON.NEXT_DAY_PROGRAM }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card v-if="nextDaysProgramList" :body-style="{ padding: '0px' }">
      <div slot="header">
        <span class="bold color-primary">{{ COMMON.NEXT_DAY_PROGRAM }}</span>
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
            style="width: 180px;"
            @change="searchProgram"
          />
        </el-form-item>
        <el-form-item :label="COMMON.CHANNEL">
          <el-select
            v-model="programSearchForm.channels"
            multiple
            size="small"
            :placeholder="COMMON.SELECT_CHANNEL"
            style="width: 180px"
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
            style="width: 180px"
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
        <el-form-item v-if="isSearching">
          <el-tooltip :content="COMMON.CLEAR_SEARCH" placement="top" effect="dark">
            <el-button size="small" icon="el-icon-close" type="danger" @click="clearSearchingForm" />
          </el-tooltip>

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
      nextDaysProgramList: 'nextDaysProgramList',
      channelList: 'channelList',
      nextDaysScheduleList: 'nextDaysScheduleList'
    }),
    isSearching() {
      return this.programSearchForm.name || this.programSearchForm.channels.length > 0 ||
      this.programSearchForm.categories.length > 0
    }
  },
  watch: {
    programList: {
      immediate: true,
      handler() {
        if (!this.programList) {
          this.$store.dispatch('app/fetchProgramList', {})
        } else {
          if (!this.nextDaysProgramList) {
            this.updateNextDaysProgramList()
          }
        }
      }
    },
    nextDaysProgramList: {
      immediate: true,
      handler() {
        if (this.nextDaysProgramList) {
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
      if (this.programSearchForm.channels.length > 0) {
        // get channels of program in nextDaysProgramList
        for (const program of this.nextDaysProgramList) {
          program.channels = []
          for (const schedule of this.nextDaysScheduleList) {
            if (schedule.programId === program.id && !program.channels.includes(schedule.channelId)) {
              program.channels.push(schedule.channelId)
            }
          }
        }
      }
      this.programData = this.nextDaysProgramList.filter(program => {
        return this.filterByCategory(program) && this.filterByChannel(program) && this.filterByName(program)
      })
    },
    filterByCategory(program) {
      if (this.programSearchForm.categories.length > 0) {
        return this.isTwoArrayHaveSameElement(program.categories, this.programSearchForm.categories)
      }
      return true
    },
    filterByChannel(program) {
      if (this.programSearchForm.channels.length > 0) {
        return this.isTwoArrayHaveSameElement(program.channels, this.programSearchForm.channels)
      }
      return true
    },
    filterByName(program) {
      if (this.programSearchForm.name) {
        return program.name.toLowerCase().includes(this.programSearchForm.name.toLowerCase())
      }
      return true
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
    },
    clearSearchingForm() {
      this.programSearchForm.name = ''
      this.programSearchForm.channels = []
      this.programSearchForm.categories = []
      this.programData = this.nextDaysProgramList
    }
  }

}
</script>
