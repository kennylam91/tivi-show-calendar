<template>
  <div>
    <div class="bold mb-2">{{ title }}</div>
    <el-form ref="channelCreateForm" :model="channelData" label-width="100px">
      <el-form-item :label="COMMON.NAME">
        <el-input v-model="channelData.name" />
      </el-form-item>
      <el-form-item label="VIP">
        <el-switch v-model="channelData.isVip" />
        <span>{{ COMMON.VIP_CHANNEL_DESCRIPTION }}</span>
      </el-form-item>
      <el-form-item :label="COMMON.DESCRIPTION">
        <el-input
          v-model="channelData.description"
          type="textarea"
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="Logo">
        <Upload :picture-prop="channelData.logo" @uploaded="handleUploaded" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
        <el-button @click="cancelClick">Cancel</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>
import Upload from '@/components/upload/Upload'

export default {
  components: { Upload },
  props: {
    channelProp: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      channelData: null,
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
      if (!this.channelData.id) {
        this.$store.dispatch('app/createChannel', this.channelData).then(() => {
          this.$notify({
            title: 'Channel Created',
            type: 'success',
            duration: '4500',
            position: 'bottom-right'
          })
          this.$emit('saved')
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$store.dispatch('app/updateChannel', this.channelData).then(() => {
          this.$notify({
            title: 'Channel Updated',
            type: 'success',
            duration: '4500',
            position: 'bottom-right'
          })
          this.$emit('saved')
        }).catch(err => {
          console.log(err)
        })
      }
    },
    cancelClick() {
      this.$emit('cancel')
    },
    handleUploaded(picture) {
      this.channelData.logo = picture
    }

  }
}
</script>
