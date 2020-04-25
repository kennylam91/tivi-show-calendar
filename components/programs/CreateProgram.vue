<template>
  <div>
    <div class="bold mb-2">{{ title }}</div>
    <el-form ref="programCreateForm" :model="programData" label-width="170px">
      <el-form-item :label="COMMON.NAME">
        <el-input v-model="programData.name" />
      </el-form-item>
      <el-form-item :label="COMMON.CATEGORY">
        <el-select
          v-model="programData.categories"
          multiple
          class="w-100"
          :placeholder="COMMON.SELECT_CATEGORY"
        >
          <el-option
            v-for="item in CATEGORIES"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <span class="color-danger">{{ COMMON.NO_MORE_THAN_TWO }}</span>

      </el-form-item>

      <el-form-item :label="COMMON.DESCRIPTION">
        <el-input
          v-model="programData.description"
          type="textarea"
          :rows="6"
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
      // check is program valid: no more than 2 categories
      if (this.programData.categories) {
        if (this.programData.categories.length > 2) {
          this.$message({
            message: this.COMMON.NO_MORE_THAN_TWO,
            type: 'error'
          })
        } else {
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
        }
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
