<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ COMMON.NEXT_DAY_PROGRAM }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <section>
      <el-card
        v-if="nextDaysProgramList"
        shadow="never"
        :body-style="{ padding: '0px' }"
      >
        <div slot="header" class="justify-between-align-center">
          <h4 class="pageTitle">
            {{ COMMON.NEXT_DAY_PROGRAM }}</h4>
          <el-button
            v-if="!isSearching"
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="searchDialogVisible = true"
          >{{ COMMON.SEARCH }}</el-button>
          <el-button
            v-if="isSearching"
            type="danger"
            size="small"
            icon="el-icon-close"
            @click="handleClearSearch"
          >{{ COMMON.CLEAR_SEARCH }}</el-button>
        </div>

        <div class="row" style="margin: 0">
          <div
            v-for="program in programData"
            :key="program.id"
            class="col-sm-4 col-md-3 col-lg-2 col-6 my-2 px-1"
          >
            <Program :program="program" :small="true" />
          </div></div>
      </el-card>
    </section>

    <el-dialog
      :key="dialogKey"
      :visible.sync="searchDialogVisible"
      custom-class="dialogClass"
    >
      <ProgramSearchForm
        :clear="false"
        @search="searchProgram"
        @clear="handleClearSearch"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Program from '@/components/programs/Program'
import ProgramSearchForm from '@/components/programs/ProgramSearchForm'
import { COMMON } from '@/assets/utils/constant'

export default {
  components: { Program, ProgramSearchForm },
  data() {
    return {
      programData: null,
      searchDialogVisible: false,
      dialogKey: 0,
      isSearching: false
    }
  },
  computed: {
    ...mapGetters({
      nextDaysProgramList: 'nextDaysProgramList',
      channelList: 'channelList'
    }),
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
          this.isSearching = false
        } else {
          this.fetchNextDaysProgramList()
        }
      }
    }
  },
  created() {
  },
  methods: {
    searchProgram(searchForm) {
      this.isSearching = true
      this.programData = []
      this.programData = this.nextDaysProgramList.filter(program => {
        return this.filterByCategory(program, searchForm) &&
        this.filterByChannel(program, searchForm) &&
        this.filterByName(program, searchForm) &&
        this.filterByRank(program, searchForm)
      })
    },

    handleClearSearch() {
      this.isSearching = false
      this.programData = [...this.nextDaysProgramList]
      this.dialogKey++
    }
  },
  head: {
    title: `Truyền hình 24h - ${COMMON.NEXT_DAY_PROGRAM}`,
    meta: [
      { hid: 'description', name: 'description',
        content: 'Tổng hợp đầy đủ các chương trình được phát sóng hàng ngày trên các kênh HBO, Cinemax, AXN, Fox Movies, Red By HBO, Discovery, ...' }
    ]
  }

}
</script>
