<template>
  <div>
    <el-card :body-style="{ padding: '16px' }">
      <div slot="header" class="justify-between-align-center">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">{{ COMMON.DASHBOARD }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/programs'}">{{ COMMON.PROGRAM_LIST }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ COMMON.TODAY }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" size="small" plain @click="handleCreateProgramClick">Create Program</el-button>
      </div>
      <el-card :body-style="{ padding: '0px' }">
        <div slot="header">
          <div v-if="todayProgramList">{{ `${COMMON.TODAY_PROGRAM} (${todayProgramList.length})` }}</div>
          <div>{{ `${COMMON.SHOW_ON_HOMEPAGE}: ${todayShowNum}` }}</div>
        </div>
        <el-table v-if="todayProgramList" height="700" :data="todayProgramList" border stripe>
          <el-table-column
            prop="name"
            label="Name"
          />
          <el-table-column
            label="Category"
            width="300"
            :filters="CATEGORIES"
            :filter-method="filterCategory"
            :filter-multiple="true"
            filter-placement="bottom"
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
    todayShowNum() {
      if (this.todayProgramList) {
        return this.todayProgramList.filter(item => item.isTodayShow).length
      }
      return 0
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

    handleTodayShowChange(program) {
      this.$store.dispatch('app/updateProgram', program).then(() => {
        this.$store.dispatch('app/fetchProgramList', {}).then(() => {
          this.fetchAllProgramByDate(new Date()).then(list => {
            this.$store.dispatch('app/setTodayProgramList', list)
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
