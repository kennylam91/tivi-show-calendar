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
    })
  },
  watch: {
  },
  created() {
    this.channelId = this.$route.params.id
    this.$store.dispatch('app/fetchChannel', { channelId: this.channelId }).then(data => {
      this.channel = data
    })
  },
  methods: {
    handleSavedAction() {
      this.$store.dispatch('app/fetchChannelList')
      this.$router.push({ path: '/channels' })
    },
    handleCancel() {
      this.$router.push({ path: '/channels' })
    }
  }
}
</script>
