<template>
  <div>
    <div class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{ COMMON.HOMEPAGE }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ COMMON.TODAY_PROGRAM }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card v-if="todayProgramList" :body-style="{ padding: '0px' }">
      <div slot="header">
        <span>{{ COMMON.TODAY_PROGRAM }}</span>
      </div>
      <div class="row">
        <div
          v-for="program in todayProgramList"
          :key="program.id"
          class="col-md-3 col-6 my-2 px-2"
        >
          <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
            <el-link
              v-if="program.logo"
              :underline="false"
              @click="handleViewProgramDetail(program)"
            >
              <el-image
                style="width: 100%;"
                :src="program.logo"
                :alt="program.name"
                fit="fill"
              />
            </el-link>
            <div v-else>{{ program.name }}</div>
            <el-link
              id="programName"
              class="my-2 w-100"
              type="success"
              @click="handleViewProgramDetail(program)"
            >
              <el-tooltip
                :content="program.name | getVNTranslateName"
                placement="bottom"
                effect="dark"
              >
                <div class="shorten-text color-primary bold">
                  {{ program.name | shortenName }}
                </div>
              </el-tooltip>
            </el-link>
            <el-tag
              v-for="(item, index) in program.categories"
              :key="index"
              size="small"
              effect="dark"
              type="info"
              style="margin: 2px;"
            >
              {{ item | getCategory }}
            </el-tag>
          </el-card>
        </div></div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      programList: 'programList',
      todayProgramList: 'todayProgramList',
      channelList: 'channelList'
    })
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
  }

}
</script>
