<template>
  <div>

    <el-table v-if="channelList" :data="channelList" border stripe>
      <el-table-column
        :label="COMMON.NAME"
        width="150"
      >
        <template slot-scope="{row}">
          <span :class="{'vip-channel': row.isVip}">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        :label="COMMON.DESCRIPTION"
      >
        <template slot-scope="{row}">
          <div class="break-word">{{ row.description }}</div>
        </template>

      </el-table-column>
      <el-table-column
        align="center"
        :label="COMMON.ACTION"
        width="230"
      >
        <template slot-scope="{row}">
          <div class="mb-2">
            <el-button size="small" class="mr-2" @click="handleChannelEditClick(row)">{{ COMMON.EDIT }}</el-button>
            <el-switch
              v-model="row.isVip"
              :active-text="COMMON.SHOW"
              :inactive-text="COMMON.HIDE"
              @change="handleVipChange(row)"
            />
          </div>
          <div>
            <el-button type="success" size="small" @click="handleScheduleManageClick(row)">{{ COMMON.SCHEDULE }}</el-button>
            <el-button type="danger" size="small" @click="handleChannelDeleteClick(row)">{{ COMMON.DELETE }}</el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>
<script>

export default {
  props: {
    channelList: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
    }
  },
  computed: {

  },

  methods: {
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
          this.$store.dispatch('app/fetchChannelList')
        })
      })
    },
    handleVipChange(channel) {
      this.$store.dispatch('app/updateChannel', channel).then(() => {
        this.$store.dispatch('app/fetchChannelList')
      })
    },
    handleScheduleManageClick(row) {
      console.log('handleScheduleManageClick')
      this.$router.push({ path: `/channels/manage/${row.id}` })
    }
  }
}
</script>
