<template>
  <div class="p-4">
    <div class="justify-between-align-center">
      <div class="p-4">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><span class="bold">{{ COMMON.DASHBOARD }}</span></el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-button type="text" @click="handleLogout">Log out</el-button>

    </div>

    <el-card class="my-2" :body-style="{ padding: '16px' }">
      <div slot="header" class="justify-between-align-center">
        <span class="bold">{{ COMMON.CHANNEL_LIST }}</span>
        <el-button type="primary" size="small" plain @click="handleCreateChannelClick">{{ COMMON.CREATE_CHANNEL }}</el-button>
      </div>
      <el-table :data="channelList" border stripe>
        <el-table-column
          :label="COMMON.NAME"
        >
          <template slot-scope="{row}">
            <span :class="{'vip-channel': row.isVip}">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          :label="COMMON.DESCRIPTION"
        />
        <el-table-column
          align="center"
          :label="COMMON.ACTION"
          width="270"
        >
          <template slot-scope="scope">
            <el-button size="small" @click="handleChannelEditClick(scope.row)">{{ COMMON.EDIT }}</el-button>
            <el-button type="success" size="small" @click="handleScheduleManageClick(scope.row)">{{ COMMON.SCHEDULE }}</el-button>
            <el-button type="danger" size="small" @click="handleChannelDeleteClick(scope.row)">{{ COMMON.DELETE }}</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <el-card class="my-2" :body-style="{ padding: '16px' }">
      <div slot="header">
        <span>
          <span class="bold">{{ COMMON.TODAY_PROGRAM }}</span>
          <nuxt-link style="float:right;" to="/programs">All Programs</nuxt-link>
        </span>
      </div>
      <el-table v-if="todayProgramList" :data="todayProgramList" border stripe>
        <el-table-column
          prop="name"
          label="Name"
        />
        <el-table-column
          label="Category"
          width="170"
        >
          <template slot-scope="{row}">
            <div>
              <el-tag effect="dark" type="success">{{ row.category | getCategory }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.isTodayShow"
              :active-text="COMMON.SHOW"
              :inactive-text="COMMON.HIDE"
              @change="handleTodayShowChange(row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="my-2" :body-style="{ padding: '16px' }">
      <div slot="header">
        <span>
          <span class="bold">{{ COMMON.NEXT_THREE_DAY_PROGRAM }}</span>
          <nuxt-link style="float:right;" to="/programs">All Programs</nuxt-link>
        </span>
      </div>
      <el-table v-if="nextSomeDayProgramList" :data="nextSomeDayProgramList" border stripe>
        <el-table-column
          prop="name"
          label="Name"
        />
        <el-table-column
          label="Category"
          width="170"
        >
          <template slot-scope="{row}">
            <div>
              <el-tag effect="dark" type="success">{{ row.category | getCategory }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.isTodayShow"
              :active-text="COMMON.SHOW"
              :inactive-text="COMMON.HIDE"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'auth',
  data() {
    return {
      todayProgramList: null,
      nextSomeDayProgramList: null,
      days: 3
    }
  },
  computed: {
    ...mapGetters({
      programList: 'programList',
      channelList: 'channelList'
    })
  },
  created() {
    // fetch all channel
    this.$store.dispatch('app/fetchChannelList')
    // fetch all programs
    this.$store.dispatch('app/fetchProgramList', {}).then(() => {
      this.fetchAllProgramByDate(new Date()).then(list => {
        this.todayProgramList = list
      })
      this.fetchAllProgramNextDays(this.days).then(list => {
        this.nextSomeDayProgramList = list
      })
    })
  },
  methods: {
    handleCreateProgramClick() {
      console.log('handleCreateProgramClick')
      this.$router.push({ path: '/programs/create' })
    },
    handleCreateChannelClick() {
      console.log('handleCreateChannelClick')
      this.$router.push({ path: '/channels/create' })
    },
    handleChannelEditClick(row) {
      this.$router.push({ path: `/channels/edit/${row.id}` })
    },
    handleChannelDeleteClick(row) {
      this.$confirm('Delete this channel?', 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('app/deleteChannel', { channelId: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed'
          })
          this.$store.dispatch('app/fetchChannelList')
        })
      })
    },
    handleScheduleManageClick(row) {
      console.log('handleScheduleManageClick')
      this.$router.push({ path: `/channels/manage/${row.id}` })
    },
    handleLogout() {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.push({ path: this.redirect || '/' })
      })
    },
    handleTodayShowChange(program) {
      this.$store.dispatch('app/updateProgram', program).then(() => {
        this.$store.dispatch('app/fetchProgramList', {}).then(() => {
          this.fetchAllProgramByDate(new Date()).then(list => {
            this.todayProgramList = list
          })
        })
      })
    }
  }
}
</script>
<style scoped>
.vip-channel{
  font-weight: bold;
  color: red;
}
</style>
