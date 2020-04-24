<template>
  <div v-if="program.id">
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
          <div class="col-sm-4 text-center">
            <img class="img-fluid " :src="program.logo" :alt="program.name">
          </div>
          <div class="col-sm-8">
            <span class="color-primary bold block">{{ program.name }}</span>
            <div>
              <span>{{ COMMON.CATEGORY }}: </span><el-tag v-for="(item, index) in program.categories" :key="index" size="small" effect="dark" type="info" style="margin: 2px;">
                {{ item | getCategory }}
              </el-tag>
            </div>
            <p class="smaller-font-size">{{ program.description }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      program: null,
      programId: null
    }
  },
  computed: {
    ...mapGetters({
      programList: 'programList'
    })
  },
  watch: {
    programList: {
      immediate: true,
      deep: true,
      handler() {
        this.programId = this.$route.params.id.split('-').pop()
        if (this.programList) {
          this.program = this.programList.find(item => item.id === this.programId)
        } else {
          this.$store.dispatch('app/fetchProgram', { programId: this.program.id }).then(data => {
            this.program = data
          })
        }
      }
    }
  },
  created() {

  }
}
</script>
