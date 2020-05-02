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
            class="searchFormItem"
            :placeholder="COMMON.INPUT_PROGRAM_NAME"
            @change="searchProgram"
          />
        </el-form-item>
        <el-form-item :label="COMMON.CHANNEL">
          <el-select
            v-model="programSearchForm.channels"
            multiple
            class="searchFormItem"
            size="small"
            :placeholder="COMMON.SELECT_CHANNEL"
            @change="searchProgram"
          >
            <el-option
              v-for="channel in vipChannelList"
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
            class="searchFormItem"
            size="small"
            :placeholder="COMMON.SELECT_CATEGORY"
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
          <el-tooltip slot="label" :content="COMMON.CLEAR_SEARCH" placement="top" effect="dark">
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
      nextDaysProgramList: 'nextDaysProgramList',
      channelList: 'channelList'
    }),
    isSearching() {
      return this.programSearchForm.name || this.programSearchForm.channels.length > 0 ||
      this.programSearchForm.categories.length > 0
    },
    vipChannelList() {
      return this.channelList.filter(channel => channel.isVip === true)
    }
  },
  watch: {
    nextDaysProgramList: {
      immediate: true,
      handler() {
        if (this.nextDaysProgramList) {
          this.searchProgram()
        } else {
          this.fetchNextDaysProgramList()
        }
      }
    }
  },
  created() {
  },
  methods: {
    searchProgram() {
      this.programData = []
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
