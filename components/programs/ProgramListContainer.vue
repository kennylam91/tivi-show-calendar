<template>
  <div>
    <article class="mt-4">
      <div class="justify-between-align-center">
        <h5 class="categoryTitle" style="margin-bottom: 0;">{{ title }}</h5>
        <el-button
          v-if="total > 12"
          class="color-info"
          type="text"
          @click="viewAll"
        >{{ COMMON.VIEW_MORE }}({{ total }})</el-button>
      </div>
      <el-card v-loading="loading" :body-style="{ padding: '0px' }" shadow="never">
        <div class="row" style="margin: 0">
          <div
            v-for="(program, index) in list"
            :key="index"
            class="col-sm-4 col-md-3 col-lg-2 col-6 my-2 px-1"
          >
            <Program :program="program" :small="true" />
          </div></div>
      </el-card>

    </article>

  </div>
</template>

<script>
import Program from './Program'
export default {
  components: { Program },
  props: {
    programListProp: {
      required: true,
      type: Array
    },
    title: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      list: null,
      loading: false
    }
  },
  computed: {
    total() {
      return this.programListProp.length
    }
  },
  watch: {
    programListProp: {
      deep: true,
      immediate: true,
      handler() {
        this.list = this.programListProp.slice(0, 12)
      }
    }
  },
  created() {
    this.list = this.programListProp.slice(0, 12)
  },
  methods: {
    viewAll() {
      this.loading = true
      this.list = this.programListProp
      setTimeout(() => {
        this.loading = false
      }, 500)
    }
  }
}
</script>
