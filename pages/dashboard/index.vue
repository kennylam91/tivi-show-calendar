<template>
  <div class="p-4">
    <div class="justify-between-align-center">
      <span class="bold">{{ COMMON.DASHBOARD }}</span>
      <el-button type="text" @click="handleLogout">Log out</el-button>

    </div>

    <el-card class="my-2" :body-style="{ padding: '16px' }">
      <div slot="header" class="justify-between-align-center">
        <span>{{ COMMON.CHANNEL_LIST }}</span>
        <el-button type="primary" size="small" plain @click="handleCreateChannelClick">{{ COMMON.CREATE_CHANNEL }}</el-button>
      </div>
      <el-table :data="channelList" border stripe>
        <el-table-column
          prop="name"
          :label="COMMON.NAME"
        />
        <el-table-column
          prop="description"
          :label="COMMON.DESCRIPTION"
        />
        <el-table-column
          align="center"
          :label="COMMON.ACTION"
          width="270"
        >
          <template slot-scope="scope">
            <el-button size="small" @click="handleChannelEditClick(scope.row)">{{ COMMON.EDIT }}</el-button>
            <el-button type="success" size="small" @click="handleScheduleManageClick(scope.row)">{{ COMMON.SCHEDULE }}</el-button>
            <el-button type="danger" size="small" @click="handleChannelDeleteClick(scope.row)">{{ COMMON.DELETE }}</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <el-card class="my-2" :body-style="{ padding: '16px' }">
      <div slot="header">
        <span>
          <nuxt-link to="/programs">Programs</nuxt-link>
        </span>
      </div>
      <!-- card body -->
    </el-card>

  </div>
</template>
<script>

export default {
  middleware: 'auth',
  data() {
    return {
      channelList: []
    }
  },
  created() {
    // fetch all channel
    this.$store.dispatch('app/fetchChannelList').then(list => {
      this.channelList = list
    })
    // fetch all programs
    this.$store.dispatch('app/fetchProgramList')
  },
  methods: {
    handleCreateProgramClick() {
      console.log('handleCreateProgramClick')
      this.$router.push({ path: '/programs/create' })
    },
    handleCreateChannelClick() {
      console.log('handleCreateChannelClick')
      this.$router.push({ path: '/channels/create' })
    },
    handleChannelEditClick(row) {
      this.$router.push({ path: `/channels/edit/${row.id}` })
    },
    handleChannelDeleteClick(row) {
      this.$confirm('Delete this channel?', 'Delete', {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('app/deleteChannel', { channelId: row.id }).then(() => {
          this.$message({
            type: 'success',
            message: 'Delete completed'
          })
          this.$store.dispatch('app/fetchChannelList').then(list => {
            this.channelList = list
          })
        })
      })
    },
    handleScheduleManageClick(row) {
      console.log('handleScheduleManageClick')
      this.$router.push({ path: `/channels/manage/${row.id}` })
    },
    handleLogout() {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.push({ path: this.redirect || '/' })
      })
    }
  }
}
</script>
