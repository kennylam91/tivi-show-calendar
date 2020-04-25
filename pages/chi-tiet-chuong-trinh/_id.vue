<template>
  <div v-if="program">
    <div class="py-4 w-100">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item class="shorten-text" style="max-width: 70%;">
          <span>{{ program.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
      <div slot="header">
        <div class="row mb-2">
          <div class="col-sm-4 col-md-3 text-center">
            <img class="img-fluid " :src="program.logo" :alt="program.name">
          </div>
          <div class="col-sm-8 col-md-9">
            <div class="color-primary bold mt-1">{{ program.name }}</div>
            <div>
              <span>{{ COMMON.CATEGORY }}: </span><el-tag v-for="(item, index) in program.categories" :key="index" size="small" effect="dark" type="info" style="margin: 2px;">
                {{ item | getCategory }}
              </el-tag>
            </div>
            <p class="smaller-font-size">{{ program.description }}</p>
          </div>
        </div>
      </div>
      <h5>{{ COMMON.PROGRAM_SCHEDULE_NEXT_DAYS }}</h5>
      <el-table :data="scheduleList" size="small" border stripe fit style="width: 100%">
        <el-table-column
          :label="COMMON.CHANNEL"
          :min-width="44"
        >
          <template slot-scope="{row}">
            <el-link
              class="break-word"
              @click="viewChannelDetail(row.channel)"
            >{{ row.channel.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          :label="COMMON.START"
          align="center"
          :min-width="28"
        >
          <template slot-scope="{row}">
            <span class="break-word">{{ row.startTime.seconds | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="COMMON.END"
          align="center"
          :min-width="28"
        >
          <template slot-scope="{row}">
            <span class="break-word">{{ row.endTime.seconds | parseTime }}</span>
          </template>
        </el-table-column>

      </el-table>

    </el-card>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { parseVNTime } from '@/assets/utils/index'

export default {
  filters: {
    parseTime(time) {
      return parseVNTime(time, '{d}/{m}/{y} {h}:{i}{a}', true, true)
    }
  },
  data() {
    return {
      program: null,
      programId: null,
      scheduleList: null
    }
  },
  computed: {
    ...mapGetters({
      programList: 'programList',
      channelList: 'channelList'
    })
  },
  watch: {
    programList: {
      immediate: true,
      deep: true,
      handler() {
        this.programId = this.$route.params.id.split('-').pop().trim()
        if (this.programList) {
          this.program = this.programList.find(item => item.id === this.programId)
          this.fetchScheduleList()
        } else {
          this.$store.dispatch('app/fetchProgram', { programId: this.programId }).then(data => {
            this.program = data
            this.$store.dispatch('app/setProgramList', [this.program])
            this.fetchScheduleList()
          })
        }
      }
    }
  },
  created() {
    // fetch schedule list of this program from now

  },
  methods: {
    fetchScheduleList() {
      const now = new Date()
      this.$store.dispatch('app/fetchScheduleList', { programId: this.programId, startTime: now, orderBy: ['startTime', 'asc'] }).then(list => {
        list.forEach(schedule => {
          schedule.channel = this.channelList.find(item => item.id === schedule.channelId)
        })
        this.scheduleList = list
      })
    }
  }
}
</script>
