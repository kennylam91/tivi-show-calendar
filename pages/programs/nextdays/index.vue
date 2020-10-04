<template>
  <div>
    <el-card shadow="never" :body-style="{ padding: '16px' }">
      <div slot="header" class="justify-between-align-center">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">{{ COMMON.DASHBOARD }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path: '/programs'}">{{ COMMON.PROGRAM_LIST }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ COMMON.NEXT_DAY_PROGRAM }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" size="small" plain @click="handleCreateProgramClick">Create Program</el-button>
      </div>
      <el-card shadow="never" :body-style="{ padding: '0px' }">
        <div slot="header">
          <div v-if="nextDaysProgramList">{{ `${COMMON.TODAY_PROGRAM} (${nextDaysProgramList.length})` }}</div>
          <div>{{ `${COMMON.SHOW_ON_HOMEPAGE}: ${nextDaysShowNum}` }}</div>
        </div>
        <el-table v-if="nextDaysProgramList" height="700" :data="nextDaysProgramList" border stripe>
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
                v-model="row.isNextDaysShow"
                :active-text="COMMON.SHOW"
                :inactive-text="COMMON.HIDE"
                @change="handleNextDaysShowChange(row)"
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
      programList: 'programList',
      nextDaysProgramList: 'nextDaysProgramList'
    }),
    // cannot use mapGetters bz we need to change the value of object  => error cannot mutate vuex

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
    },
    nextDaysShowNum() {
      if (this.nextDaysProgramList) {
        return this.nextDaysProgramList.filter(item => item.isNextDaysShow).length
      }
      return 0
    }
  },
  watch: {
  },
  methods: {
    handleCreateProgramClick() {
      this.$router.push({ path: '/programs/create' })
    },

    handleNextDaysShowChange(program) {
      this.$store.dispatch('app/createOrUpdateProgram', program).then(() => {
        this.updateNextDaysProgramList()
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
