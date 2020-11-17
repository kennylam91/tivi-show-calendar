<template>
  <div>
    <el-form
      id="programSearchForm"
      ref="programSearchForm"
      size="small"
      :model="programSearchForm"
      class="m-2 w-90"
      :class="{'d-flex': isAdmin}"
      label-width="75px"
      align="left"
    >
      <el-form-item :label="COMMON.SEARCH">
        <el-input
          ref="searchName"
          v-model="programSearchForm.searchName"
          class=""
          :placeholder="COMMON.INPUT_PROGRAM_NAME"
          clearable
          @change="searchProgram"
        />
      </el-form-item>
      <el-form-item :label="COMMON.RANK">
        <el-select
          v-model="programSearchForm.ranks"
          class="w-100"
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
          class="w-100"
          multiple
          size="small"
          :placeholder="COMMON.SELECT_CATEGORY"
          @change="searchProgram"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item v-if="isShowSearchByTime" :label="COMMON.TIME">
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

      </el-form-item> -->
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
import { ProgramSearchForm, getProgramSearchName } from '@/assets/utils/index'
import { programRankOptions } from '@/assets/utils/constant'

export default {
  props: {
    clear: {
      required: false,
      type: Boolean,
      default: () => true
    },
    dataProp: {
      required: true,
      type: Object
    },
    isShowSearchByTime: {
      required: false,
      type: Boolean,
      default: () => true
    },
    isAdmin: {
      required: false,
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      programSearchForm: null,
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
      return this.programSearchForm.searchName ||
      this.programSearchForm.categoryCodes.length > 0 ||
      this.programSearchForm.ranks.length > 0
    },
    categoryOptions() {
      return this.categories &&
        this.categories.filter(i => [1, 11, 12, 13, 14, 16, 17, 22, 36].includes(i.code)) || []
    }

    // startTime() {
    //   return this.programSearchForm.startTime
    // },
    // endTime() {
    //   return this.programSearchForm.endTime
    // }
  },
  watch: {
    dataProp: {
      immediate: true,
      deep: true,
      handler() {
        if (this.dataProp) {
          this.programSearchForm = new ProgramSearchForm()
          this.programSearchForm.searchName = this.dataProp.searchName
          this.programSearchForm.categoryCodes = [...this.dataProp.categoryCodes]
          this.programSearchForm.ranks = [...this.dataProp.ranks]
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
  mounted() {
    setTimeout(() => {
      this.$refs.searchName.focus()
    }, 200)
  },
  methods: {
    searchProgram() {
      this.$emit('search', this.programSearchForm)
    },
    clearSearchingForm() {
      this.programSearchForm.searchName = ''
      this.programSearchForm.channels = []
      this.programSearchForm.categories = []
      this.programSearchForm.ranks = []
      this.$emit('clear')
    }

  }
}
</script>
<style>
#programSearchForm .el-select__tags{
  max-width: 100% !important;
}
</style>
