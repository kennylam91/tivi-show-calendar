<template>
  <div>
    <div class="bold mb-2">{{ title }}</div>
    <el-form ref="channelCreateForm" :model="channelData" label-width="120px" size="small">
      <el-form-item :label="COMMON.NAME">
        <el-input v-model="channelData.name" />
      </el-form-item>
      <el-form-item label="VIP">
        <el-switch v-model="channelData.vip" />
        <span class="d-inline-block mr-5">{{ COMMON.VIP_CHANNEL_DESCRIPTION }}</span>
      </el-form-item>
      <el-form-item label="Category" size="small">
        <el-input v-model="channelData.category" />
      </el-form-item>
      <el-form-item label="Import source" size="small">
        <el-select v-model="channelData.importSource" :disabled="!channelData.hasAutoImport" class="mr-5">
          <el-option
            v-for="item in ['SCTV', 'VTV', 'THVL']"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>

        <span>Auto import</span>
        <el-switch v-model="channelData.hasAutoImport" class="mr-5" />
        <span>Program Auto Search</span>
        <el-switch v-model="channelData.isProgramAutoSearch" />
      </el-form-item>
      <el-form-item label="SctvChannelCode">
        <el-input v-model="channelData.sctvChannelCode" />
      </el-form-item>

      <el-form-item :label="COMMON.DESCRIPTION">
        <el-input
          v-model="channelData.description"
          type="textarea"
          :rows="5"
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
      this.$store.dispatch('app/createOrUpdateChannel', this.channelData).then(() => {
        this.$notify({
          title: this.channelData.id ? 'Channel Updated' : 'Channel Created',
          type: 'success',
          duration: '4500',
          position: 'bottom-right'
        })
        this.$store.dispatch('app/fetchChannelList')
        this.$emit('saved')
      })
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
