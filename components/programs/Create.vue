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
        <el-button @click="handleCancelClick">Cancel</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { firebase } from '../../FireBase'
import { trimObject } from '@/utils/index'

export default {
  props: {
    programProp: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      programData: null,
      ref: firebase.firestore().collection('programs')
    }
  },
  computed: {
    title() {
      if (this.programProp.id) {
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
      if (!this.programData.id) {
        this.ref.add(trimObject(this.programData)).then(ref => {
          console.log('add program success')
          this.$notify({
            title: 'Program Created',
            type: 'success',
            duration: '4500',
            position: 'top-right'
          })
          this.$emit('saved')
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.ref.doc(this.programData.id).set(trimObject(this.programData)).then(() => {
          console.log('update program ok')
          this.$notify({
            title: 'Program Updated',
            type: 'success',
            duration: '4500',
            position: 'top-right'
          })
          this.$emit('saved')
        }).catch(err => {
          console.log(err)
        })
      }
    },
    handleCancelClick() {
      this.$emit('cancel')
    }
  }
}
</script>
