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
export default {
  data() {
    return {
      program: {
        id: null
      }
    }
  },
  created() {
    this.program.id = this.$route.params.id.split('-').pop()
    this.$store.dispatch('app/fetchProgram', { programId: this.program.id }).then(data => {
      this.program = data
    })
  }
}
</script>
