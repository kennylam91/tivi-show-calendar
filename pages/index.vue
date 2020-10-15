<template>
  <div>
    <article v-if="broadCastingPrograms" class="pb-2 pt-4">
      <h4 class="color-dark-blue">
        {{ COMMON.ON_BROADCASTING_PROGRAMS | uppercaseFirst }}
      </h4>
      <el-divider class="mt-4 mb-2" />
      <div class="row">
        <div
          v-for="program in broadCastingPrograms"
          :key="program.id"
          class="col-md-3 col-6 my-2 px-1"
        >
          <Program v-if="program" :live="true" :program="program" />
        </div>
      </div>
    </article>

    <client-only>

      <article v-if="todayNoonProgramData" class="py-2">
        <h4 class="color-dark-blue">{{ COMMON.WHAT_SEE_THIS_NOON }}      </h4>
        <el-divider class="mt-4 mb-2" />
        <div class="row mt-2">
          <div
            v-for="program in todayNoonProgramData"
            :key="program.id"
            class="col-md-3 col-6 px-1 my-2"
          >
            <Program :live="true" :program="program" />
          </div>
        </div>
      </article>

      <article v-if="tonightProgramData" class="py-2">
        <h4 class="color-dark-blue">{{ COMMON.WHAT_SEE_THIS_EVENING }}      </h4>
        <el-divider class="mt-4 mb-2" />
        <div class="row mt-2">
          <div
            v-for="program in tonightProgramData"
            :key="program.id"
            class="col-md-3 col-6 px-1 my-2"
          >
            <Program :live="true" :program="program" />
          </div>
        </div>
      </article>

      <!-- <article class="py-2">
      <h4>
        <nuxt-link to="/chuong-trinh-hom-nay" class="color-dark-blue">
          {{ COMMON.VIP_INCOMING_PROGRAM | uppercaseFirst }}
          <el-divider class="mt-4 mb-2" />
        </nuxt-link>
      </h4>
      <div class="row mt-2">
        <div
          v-for="program in broadCastingProgramData"
          :key="program.id"
          class="col-md-3 col-6 my-2 px-1"
        >
          <Program :program="program" />
        </div>
      </div>
    </article> -->

      <article class="py-2">
        <h4>
          <nuxt-link to="/chuong-trinh-sap-chieu" class="color-dark-blue">
            {{ COMMON.VIP_TOMORROW_PROGRAM | uppercaseFirst }}
          </nuxt-link>
        </h4>
        <el-divider class="mt-4 mb-2" />
        <div class="row mt-2">
          <div
            v-for="program in nextDayProgramData"
            :key="program.id"
            class="col-md-3 col-6 px-1 my-2"
          >
            <Program :program="program" />
          </div>
        </div>
      </article>
    </client-only>

    <article class="py-2">
      <h4>
        <nuxt-link to="/danh-sach-kenh" class="color-dark-blue">
          {{ COMMON.VIP_CHANNEL | uppercaseFirst }}
        </nuxt-link>
      </h4>
      <el-divider class="mt-4 mb-2" />

      <div class="row mt-2">
        <div v-for="(channel) in vipChannelList" :key="channel.id" class="col-md-3 col-6 my-2 px-1">
          <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
            <el-link
              v-if="channel.logo"
              :underline="false"
              @click="viewChannelDetail(channel)"
            >
              <img
                v-lazy="channel.logo"
                class="img-fluid"
                :alt="channel.name"
              >
            </el-link>
            <el-button
              class="my-2 w-100 py-2 px-1"
              size="small"
              type="info"
              plain
              @click="viewChannelDetail(channel)"
            >{{ COMMON.SCHEDULE }} {{ channel.name }}</el-button>
          </el-card>
        </div>
      </div>
    </article>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Program from '@/components/programs/Program'

export default {
  components: { Program },
  data() {
    return {
      broadCastingProgramData: null,
      nextDayProgramData: null,
      broadCastingPrograms: null,
      todayNoonProgramData: null,
      tonightProgramData: null
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      vipChannelList: 'vipChannelList',
      todayNoonProgramList: 'todayNoonProgramList',
      toNightProgramList: 'toNightProgramList',
      nextDaysVipProgramList: 'nextDaysVipProgramList',
      broadCastingProgramList: 'broadCastingProgramList'
    })
  },
  watch: {
  },
  created() {
    const baseQuery = { limit: 8, page: 1, sortBy: 'rank', sortDirection: 'DESC' }
    if (this.broadCastingProgramList) {
      this.broadCastingProgramData = this.broadCastingProgramList
    } else {
      this.$store.dispatch('app/fetchTodayPrograms',
        { isBroadCasting: true, ...baseQuery }).then(res => {
        this.broadCastingPrograms = res
        this.$store.dispatch('app/setBroadCastingProgramList', res)
      })
    }

    const now = new Date()
    const time11h = (new Date()).setHours(11, 0, 0, 0)
    const time13h = (new Date()).setHours(13, 0, 0, 0)
    const time19h = (new Date()).setHours(19, 0, 0, 0)
    const time22h = (new Date()).setHours(22, 0, 0, 0)
    const time24h = (new Date()).setHours(24, 0, 0, 0)
    const startNextDay = time24h
    const endNextDay = time24h + 24 * 60 * 60 * 1000
    if (now < time11h) {
      if (this.todayNoonProgramList) {
        this.todayNoonProgramData = this.todayNoonProgramList
      } else {
        this.$store.dispatch('app/fetchTodayPrograms',
          { startTimeFrom: now < time11h ? time11h : now, startTimeTo: time13h }).then(res => {
          this.todayNoonProgramData = res
          this.$store.dispatch('app/setTodayNoonProgramList', res)
        })
      }
    }
    if (now < time22h) {
      if (this.toNightProgramList) {
        this.tonightProgramData = this.toNightProgramList
      } else {
        this.$store.dispatch('app/fetchTodayPrograms',
          { startTimeFrom: now < time19h ? time19h : now, startTimeTo: time24h }).then(res => {
          this.tonightProgramData = res
          this.$store.dispatch('app/setTonightProgramList', res)
        })
      }
    }
    if (this.nextDaysVipProgramList) {
      this.nextDayProgramData = this.nextDaysVipProgramList
    } else {
      this.$store.dispatch('app/fetchTomorrowPrograms',
        { ...baseQuery, startTimeFrom: startNextDay,
          startTimeTo: endNextDay }).then(res => {
        this.nextDayProgramData = res
        this.$store.dispatch('app/setNextDaysVipProgramList', res)
      })
      setTimeout(() => {
        this.$store.dispatch('app/logHomepage')
      }, 2000)
    }
  },
  methods: {
    getFourOrEightPrograms(programList) {
      if (!programList) {
        return null
      }
      if (programList.length > 8) {
        return programList.slice(0, 8)
      } else {
        return programList.slice(0, 4)
      }
    }

  }

}
</script>

<style>

.links {
  padding-top: 15px;
}
</style>
