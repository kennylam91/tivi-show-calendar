<template>
  <div>
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
          v-model="programSearchForm.searchName"
          class="searchFormItem"
          :placeholder="COMMON.INPUT_PROGRAM_NAME"
          @change="searchProgram"
        />
      </el-form-item>
      <!-- <el-form-item :label="COMMON.CHANNEL">
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
      </el-form-item> -->
      <el-form-item :label="COMMON.RANK">
        <el-select
          v-model="programSearchForm.ranks"
          class="searchFormItem"
          multiple
          size="small"
          :placeholder="COMMON.RANK"
          @change="searchProgram"
        >
          <el-option
            v-for="item in programRankOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="COMMON.CATEGORY">
        <el-select
          v-model="programSearchForm.categoryCodes"
          class="searchFormItem"
          multiple
          size="small"
          :placeholder="COMMON.SELECT_CATEGORY"
          @change="searchProgram"
        >
          <el-option
            v-for="item in categories"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="COMMON.TIME">
        <el-time-select
          v-model="programSearchForm.startTime"
          :placeholder="COMMON.START"
          style="width: 110px;"
          :picker-options="{
            start: '00:00',
            step: '01:00',
            end: '24:00'
          }"
        />
        <el-time-select
          v-model="programSearchForm.endTime"
          :placeholder="COMMON.END"
          style="width: 115px;"
          :picker-options="{
            start: '04:30',
            step: '00:30',
            end: '24:00',
            minTime: programSearchForm.startTime
          }"
        />

      </el-form-item>
      <el-form-item v-if="clearBtnShow">
        <el-tooltip
          slot="label"
          :content="COMMON.CLEAR_SEARCH"
          placement="top"
          effect="dark"
        >
          <el-button
            class="clearBtn"
            size="small"
            icon="el-icon-close"
            type="danger"
            @click="clearSearchingForm"
          />
        </el-tooltip>

      </el-form-item>

    </el-form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { programRankOptions } from '@/assets/utils/constant'

export default {
  props: {
    clear: {
      required: false,
      type: Boolean,
      default: () => true
    },
    dataProp: {
      required: false,
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      programSearchForm: {
        name: '',
        channels: [],
        categories: [],
        ranks: [],
        startTime: null,
        endTime: null
      },
      programRankOptions

    }
  },
  computed: {
    ...mapGetters({
      todayProgramList: 'fromNowInDayProgramList',
      channelList: 'channelList',
      categories: 'categories'
    }),
    clearBtnShow() {
      return this.isSearching && this.clear
    },
    vipChannelList() {
      return this.channelList.filter(channel => channel.vip === true)
    },
    isSearching() {
      return this.programSearchForm.name ||
      this.programSearchForm.channels.length > 0 ||
      this.programSearchForm.categories.length > 0 ||
      this.programSearchForm.ranks.length > 0
    },
    startTime() {
      return this.programSearchForm.startTime
    },
    endTime() {
      return this.programSearchForm.endTime
    }
  },
  watch: {
    dataProp: {
      immediate: true,
      deep: true,
      handler() {
        if (this.dataProp) {
          this.programSearchForm = { ...this.dataProp }
        }
      }
    },
    startTime() {
      this.searchProgram()
    },
    endTime() {
      this.searchProgram()
    }
  },
  created() {
    if (!this.categories) {
      this.$store.dispatch('app/fetchCategories', {})
    }
  },
  methods: {
    searchProgram() {
      this.$emit('search', this.programSearchForm)
    },
    clearSearchingForm() {
      this.programSearchForm.name = ''
      this.programSearchForm.channels = []
      this.programSearchForm.categories = []
      this.programSearchForm.ranks = []
      this.$emit('clear')
    }

  }
}
</script>
