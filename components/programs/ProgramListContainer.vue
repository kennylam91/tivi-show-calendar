<template>
  <div>
    <article class="mt-3">
      <div class="justify-between-align-center">
        <h5 class="categoryTitle" style="margin-bottom: 4px;">{{ title }}</h5>

      </div>
      <el-card :body-style="{ padding: '0px' }" shadow="never">
        <div class="row" style="margin: 0">
          <div
            v-for="(program) in list"
            :key="program.id"
            class="col-sm-4 col-md-3 col-lg-2 col-6 my-2 px-1"
          >
            <Program :program="program" :small="true" />
          </div>
        </div>

        <div class="text-center">
          <el-button
            v-if="isShowViewMoreBtn"
            type="text"
            @click="viewAll"
          >{{ COMMON.VIEW_MORE }}({{ total }})
          </el-button>

          <el-button
            v-if="list.length > 12"
            type="text"
            @click="viewLess"
          >{{ COMMON.VIEW_LESS }}</el-button>
        </div>
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
      list: null
    }
  },
  computed: {
    total() {
      return this.programListProp.length
    },
    isShowViewMoreBtn() {
      return this.total > 12 && this.list.length < this.programListProp.length
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
  mounted() {
    this.list = this.programListProp.slice(0, 12)
  },
  methods: {
    viewAll() {
      this.list = this.programListProp
    },
    viewLess() {
      this.list = this.programListProp.slice(0, 12)
    }
  }
}
</script>
