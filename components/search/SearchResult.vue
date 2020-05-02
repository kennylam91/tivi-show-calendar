<template>
  <el-link id="searchResult" class=" w-100" :underline="false" @click="handleLinkClick">
    <div class="flex w-100 " style="align-items: center;">
      <img class="img-fluid " :src="result.logo" :alt="result.name" :width="width">
      <div
        class="break-word smaller-font-size color-warning searchResultName"
        style="margin: 0 0 7px 10px;"
      >
        {{ result.name }}
      </div>
    </div>
  </el-link>
</template>

<script>
export default {
  props: {
    result: {
      required: true,
      type: Object
    },
    width: {
      required: false,
      type: Number,
      default: 100
    }
  },
  methods: {
    handleLinkClick() {
      // program has categories
      if (this.result.categories !== undefined) {
        this.viewProgramDetail(this.result)
      } else {
        this.viewChannelDetail(this.result)
      }
    }
  }
}
</script>
<style >
#searchResult .el-link--inner{
  width: 100%;
}
#searchResult:hover{
  background:#f1f1f1;
}
.searchResultName{
  max-height: 2rem;
  overflow-y: hidden;
  text-overflow: ellipsis;
}
</style>
