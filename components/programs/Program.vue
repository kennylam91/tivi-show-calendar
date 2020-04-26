<template>
  <div>
    <el-card shadow="hover" :body-style="{ padding: '5px','text-align':'center' }">
      <el-link
        v-if="program.logo"
        :underline="false"
        @click="viewProgramDetail(program)"
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
        type="primary"
        @click="viewProgramDetail(program)"
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
        style="margin: 2px; padding: 0 4px;"
      >
        {{ item | getCategory }}
      </el-tag>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    program: {
      required: true,
      type: Object
    }
  }
}
</script>
