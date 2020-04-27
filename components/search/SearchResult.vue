<template>
  <div class="justify-between-align-center">
    <img class="img-fluid " :src="result.logo" :alt="result.name" :width="width">
    <div>
      {{ result.name }}
    </div>
  </div>
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
