<template>
  <el-link id="searchResult" class=" w-100" :underline="false">
    <div class="flex w-100 " style="align-items: center;">
      <img class="img-fluid " :src="result.logo" :alt="result.name" :width="width">
      <div class="ml-2">
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
</style>
