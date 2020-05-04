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
      <div
        class="color-info smaller-font-size my-2 shorten-text"
      >
        {{ program.name | shortenName | uppercaseAll }}
      </div>
      <el-link
        id="programName"
        class="mb-2 w-100"
        type="primary"
        :underline="false"
        @click="viewProgramDetail(program)"
      >
        <el-tooltip
          :content="program.name | getVNTranslateName"
          placement="bottom"
          effect="dark"
        >
          <div class="color-primary bold smaller-font-size programName">
            {{ program.name | getVNTranslateName | uppercaseAll }}
          </div>
        </el-tooltip>
      </el-link>

      <el-tag
        v-for="(item, index) in getCategoryList(program.categories)"
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
  },
  computed: {

  },
  methods: {
    getCategoryList(categories) {
      if (categories) {
        if (categories.length <= 2) {
          return categories
        } else if (categories.includes(1)) {
          return categories.filter(item => item !== 1).slice(0, 2)
        } else {
          return categories.slice(0, 2)
        }
      } else {
        return []
      }
    }
  }
}
</script>
