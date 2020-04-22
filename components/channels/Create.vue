<template>
  <div>
    <div class="bold mb-2">{{ title }}</div>
    <el-form ref="channelCreateForm" :model="channelData" label-width="100px">
      <el-form-item label="Name">
        <el-input v-model="channelData.name" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input
          v-model="channelData.description"
          type="textarea"
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="Logo">
        <el-button type="text" @click="imagecropperShow = true">Upload</el-button>
        <img class="ml-2" :src="channelData.logo" width="100">
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
        <el-button @click="cancelClick">Cancel</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>
import { firebase } from '../../FireBase'
import { trimObject } from '@/assets/utils/index'

export default {
  components: { },
  props: {
    channelProp: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      channelData: null,
      channelRef: firebase.firestore().collection('channels'),
      scheduleRef: firebase.firestore().collection('schedule'),
      scheduleList: []
    }
  },
  computed: {
    title() {
      if (this.channelProp.id) {
        return 'Update channel'
      } else {
        return 'Create channel'
      }
    }
  },
  watch: {
    channelProp: {
      immediate: true,
      handler() {
        this.channelData = { ...this.channelProp }
      }
    }
  },
  created() {

  },
  methods: {
    onSubmit() {
      console.log('onSubmit')
      if (!this.channelData.id) {
        this.channelRef.add(trimObject(this.channelData)).then(ref => {
          console.log('add channel success')
          this.$notify({
            title: 'Channel Created',
            type: 'success',
            duration: '4500',
            position: 'top-right'
          })
          this.$emit('saved')
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.channelRef.doc(this.channelData.id).set(trimObject(this.channelData)).then(() => {
          console.log('update channel ok')
          this.$notify({
            title: 'Channel Updated',
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
    cancelClick() {
      this.$emit('cancel')
    }

  }
}
</script>
