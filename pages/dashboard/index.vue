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
    <el-card shadow="never" :body-style="{ padding: '16px' }">
      <nuxt-link to="/channels">{{ COMMON.CHANNEL_LIST }}</nuxt-link>

    </el-card>

    <el-card shadow="never" class="my-2" :body-style="{ padding: '16px' }">

      <nuxt-link to="/programs">
        <div class="mb-2">{{ COMMON.PROGRAM_LIST }}</div></nuxt-link>
      <nuxt-link to="/programs/today">
        <div class="mb-2">{{ COMMON.TODAY_PROGRAM }}</div>
      </nuxt-link>
      <nuxt-link to="/programs/nextdays">
        <div class="mb-2">{{ COMMON.NEXT_DAY_PROGRAM }}</div>
      </nuxt-link>
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
    })
    // cannot use mapGetters bz we need to change the value of object  => error cannot mutate vuex

  },
  watch: {

  },
  created() {
  },
  methods: {
    handleCreateProgramClick() {
      console.log('handleCreateProgramClick')
      this.$router.push({ path: '/programs/create' })
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
