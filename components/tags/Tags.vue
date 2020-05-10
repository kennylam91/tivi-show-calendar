<template>
  <div>
    <span class="small-font-size">Tags: </span>
    <el-tag
      v-for="(item) in tags"
      :key="item"
      style="margin: 2px;"
      size="mini"
      type="info"
      effect="plain"
    >{{ item }}</el-tag>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      required: true,
      type: Array
    }
  },
  data() {
    return {

    }
  }
}
</script>
