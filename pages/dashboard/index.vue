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
    <el-card :body-style="{ padding: '16px' }">
      <nuxt-link to="/channels">{{ COMMON.CHANNEL_LIST }}</nuxt-link>

    </el-card>

    <el-card class="my-2" :body-style="{ padding: '16px' }">

      <nuxt-link to="/programs">
        <div class="mb-2">{{ COMMON.PROGRAM_LIST }}</div></nuxt-link>
      <nuxt-link to="/programs/today">{{ COMMON.TODAY_PROGRAM }}</nuxt-link>
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
