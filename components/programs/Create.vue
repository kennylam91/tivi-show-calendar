<template>
  <div>
    <div class="bold mb-2">{{ title }}</div>
    <el-form ref="programCreateForm" :model="programData" label-width="100px">
      <el-form-item label="Name">
        <el-input v-model="programData.name" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input
          v-model="programData.description"
          type="textarea"
          :rows="4"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { programCollection } from '../../FireBase'
export default {
  props: {
    programProp: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      programData: null
    }
  },
  computed: {
    title() {
      if (this.programProp.programId) {
        return 'Update Program'
      } else {
        return 'Create Program'
      }
    }
  },
  watch: {
    programProp: {
      immediate: true,
      handler() {
        this.programData = { ...this.programProp }
      }
    }
  },
  created() {

  },
  methods: {
    onSubmit() {
      console.log('onSubmit')
      programCollection.add(this.programData).then(ref => {
        console.log('add program success')
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
