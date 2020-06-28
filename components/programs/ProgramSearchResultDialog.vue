<template>
  <div v-if="searchResult">
    <el-dialog
      title="Search Result"
      :visible="visible"
      width="80%"
      @close="handleDialogClose"
    >
      <div class="justify-between-align-center">
        <p>Total Result: {{ searchResult.total_results }}</p>
        <el-button type="primary" size="small" @click="confirmMovie">Confirm</el-button>

      </div>
      <el-table
        height="600px"
        :data="searchResult.results"
        highlight-current-row
        border
        stripe
        @current-change="handleCurrentChange"
      >
        <el-table-column
          label="Title"
        >
          <template slot-scope="{row}">{{ row.original_title }}</template>
        </el-table-column>
        <el-table-column
          label="Title"
        >
          <template slot-scope="{row}">{{ row.title }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>
<script>
export default {
  props: {
    visibleProp: {
      required: true,
      type: Boolean
    },
    searchResultProp: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      visible: false,
      searchResult: null,
      selectedMovie: null
    }
  },
  watch: {
    visibleProp: {
      immediate: true,
      handler() {
        debugger
        this.visible = this.visibleProp
      }
    },
    searchResultProp: {
      immediate: true,
      deep: true,
      handler() {
        this.searchResult = this.searchResultProp
      }
    }
  },
  methods: {
    handleDialogClose() {
      this.$emit('close')
    },
    confirmMovie() {
      this.$emit('close', this.selectedMovie)
    },
    handleCurrentChange(val) {
      this.selectedMovie = val
    }
  }
}
</script>
