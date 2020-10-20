<template>
  <el-link id="searchResult" class=" w-100" :underline="false" @click="handleLinkClick">
    <div class="flex w-100 " style="align-items: center;">
      <img
        v-if="result.logo"
        v-lazy="result.logo"
        class="img-fluid "
        :alt="result.name"
        :width="width"
      >
      <img
        v-else
        src="~assets/images/default-program-picture.png"
        class="img-fluid"
        :alt="result.name"
      >
      <div
        v-if="!result.enName || (result.enName && result.enName === result.name)"
        class="break-word smaller-font-size color-warning searchResultName"
        style="margin: 0 0 7px 10px;"
      >{{ result.name }}</div>
      <div
        v-else
        class="break-word smaller-font-size color-warning searchResultName"
        style="margin: 0 0 7px 10px;"
      >{{ result.name }} - {{ result.enName }}</div>
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
.searchResultName:hover{
  /* background:#f1f1f1; */
  color: white!important;
}
.searchResultName{
  max-height: 2rem;
  overflow-y: hidden;
  text-overflow: ellipsis;
}
</style>
