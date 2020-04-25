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
      <el-table v-if="channelList" :data="channelList" border stripe>
        <el-table-column
          :label="COMMON.NAME"
          width="150"
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
          width="180"
          :label="COMMON.SHOW_ON_HOMEPAGE"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.isVip"
              :active-text="COMMON.SHOW"
              :inactive-text="COMMON.HIDE"
              @change="handleVipChange(row)"
            />
          </template>
        </el-table-column>
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
          width="300"
        >
          <template slot-scope="{row}">
            <div>
              <el-tag v-for="(item, index) in row.categories" :key="index" size="small" effect="dark" type="info" style="margin: 2px;">
                {{ item | getCategory }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
          :label="COMMON.SHOW_ON_HOMEPAGE"
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
      <el-table v-if="nextDaysProgramList" :data="nextDaysProgramList" border stripe>
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
              <el-tag v-for="(item, index) in row.categories" :key="index" size="small" effect="dark" type="info" style="margin: 2px;">
                {{ item | getCategory }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
        >
          <template slot-scope="{row}">
            <el-switch
              v-model="row.isNextDaysShow"
              :active-text="COMMON.SHOW"
              :inactive-text="COMMON.HIDE"
              @change="handleNextDaysShowChange(row)"
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
    }
  },
  computed: {
    ...mapGetters({
      programList: 'programList'
    }),
    // cannot use mapGetters bz we need to change the value of object  => error cannot mutate vuex
    channelList() {
      const list = this.$store.state.app.channelList
      const result = []
      if (list) {
        list.forEach(item => {
          result.push({ ...item })
        })
        return result
      } else {
        return null
      }
    },
    todayProgramList() {
      const list = this.$store.state.app.todayProgramList
      const result = []
      if (list) {
        list.forEach(item => {
          result.push({ ...item })
        })
        return result
      } else {
        return null
      }
    },
    nextDaysProgramList() {
      const list = this.$store.state.app.nextDaysProgramList
      const result = []
      if (list) {
        list.forEach(item => {
          result.push({ ...item })
        })
        return result
      } else {
        return null
      }
    }
  },
  watch: {
    channelList: {
      immediate: true,
      handler() {
        if (!this.channelList) {
          this.$store.dispatch('app/fetchChannelList')
        }
      }
    },
    programList: {
      immediate: true,
      handler() {
        if (!this.programList) {
          this.$store.dispatch('app/fetchProgramList', {})
        } else {
          if (!this.todayProgramList) {
            this.updateTodayProgramList()
          }
          if (!this.nextDaysProgramList) {
            this.updateNextDaysProgramList()
          }
        }
      }
    }
  },
  created() {
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
            this.$store.dispatch('app/setTodayProgramList', list)
          })
        })
      })
    },
    handleNextDaysShowChange(program) {
      this.$store.dispatch('app/updateProgram', program).then(() => {
        this.$store.dispatch('app/fetchProgramList', {}).then(() => {
          this.fetchAllProgramNextDays(this.COMMON.NEXT_DAYS_SHOW_NUM).then(list => {
            this.$store.dispatch('app/setNextDaysProgramList', list)
          })
        })
      })
    },
    handleVipChange(channel) {
      this.$store.dispatch('app/updateChannel', channel).then(() => {
        this.$store.dispatch('app/fetchChannelList')
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
