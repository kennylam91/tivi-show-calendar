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
          class="searchFormItem"
          multiple
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

export default {
  data() {
    return {
      programSearchForm: {
        name: '',
        channels: [],
        categories: []
      }
    }
  },
  computed: {
    ...mapGetters({
      todayProgramList: 'fromNowInDayProgramList',
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
  methods: {
    searchProgram() {
      this.$emit('search', this.programSearchForm)
    },
    clearSearchingForm() {
      this.programSearchForm.name = ''
      this.programSearchForm.channels = []
      this.programSearchForm.categories = []
      this.$emit('clear')
    }

  }
}
</script>
