<template>
  <div>
    <div class="bold mb-2">{{ title }}</div>
    <el-form ref="programCreateForm" :model="programData" label-width="170px">
      <el-form-item :label="COMMON.NAME">
        <el-input v-model="programData.name" />
      </el-form-item>
      <el-form-item :label="COMMON.CATEGORY">
        <el-select v-model="programData.category" :placeholder="COMMON.SELECT">
          <el-option
            v-for="item in CATEGORIES"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

      </el-form-item>

      <el-form-item :label="COMMON.DESCRIPTION">
        <el-input
          v-model="programData.description"
          type="textarea"
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="Logo">
        <Upload :picture-prop="programData.logo" @uploaded="handleUploaded" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ COMMON.SUBMIT }}</el-button>
        <el-button type="info" @click="handleCancelClick">{{ COMMON.CANCEL }}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import { firebase } from '../../FireBase'
import { trimObject } from '@/assets/utils/index'
import { CATEGORIES } from '@/assets/utils/constant'
import Upload from '@/components/upload/Upload'
export default {
  components: { Upload },
  props: {
    programProp: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      programData: null,
      ref: firebase.firestore().collection('programs'),
      CATEGORIES

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
        this.$store.dispatch('app/createProgram', this.programData).then(() => {
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
        this.$store.dispatch('app/updateProgram', this.programData).then(() => {
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
    },
    handleUploaded(picture) {
      this.programData.logo = picture
    }
  }
}
</script>
