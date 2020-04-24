<template>
  <div>
    <div v-if="channel" class="p-4">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/dashboard' }">{{ COMMON.DASHBOARD }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ channel.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <CreateChannel v-if="channel" class="my-2" :channel-prop="channel" @saved="handleSavedAction" @cancel="handleCancel" />
    </div>
  </div>
</template>
<script>
import CreateChannel from '@/components/channels/CreateChannel'
import { mapGetters } from 'vuex'

export default {
  components: { CreateChannel },
  middleware: 'auth',
  data() {
    return {
      channelId: null,
      channel: null
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList'
    })
  },
  watch: {
    channelList: {
      immediate: true,
      handler() {
        this.channelId = this.$route.params.id
        if (this.channelList) {
          this.channel = this.channelList.find(item => item.id === this.channelId)
        } else {
          this.$store.dispatch('app/fetchChannel', { channelId: this.channelId }).then(channel => {
            this.channel = channel
          })
        }
      }
    }
  },
  created() {

  },
  methods: {
    handleSavedAction() {
      console.log('handleSavedAction')
      this.$router.push({ path: '/dashboard' })
    },
    handleCancel() {
      this.$router.push({ path: '/dashboard' })
    }
  }
}
</script>
