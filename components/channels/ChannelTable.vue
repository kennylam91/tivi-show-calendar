<template>
  <div>

    <table class="table table-hover table-bordered small-font-size">
      <thead>
        <tr class="color-info ">
          <th scope="col" width="150">{{ COMMON.NAME }}</th>
          <th scope="col">{{ COMMON.DESCRIPTION }}</th>
          <th v-if="isAdmin" width="230">{{ COMMON.ACTION }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(channel, index) in channelList" :key="index">
          <td>
            <el-link @click="handleNameClick(channel)">
              <span class="color-primary">{{ channel.name }}</span>
            </el-link>
          </td>
          <td>{{ channel.description }}</td>
          <td v-if="isAdmin">
            <div class="mb-2">
              <el-button size="small" class="mr-2" @click="handleChannelEditClick(channel)">{{ COMMON.EDIT }}</el-button>
              <el-switch
                v-model="channel.isVip"
                :active-text="COMMON.SHOW"
                :inactive-text="COMMON.HIDE"
                @change="handleVipChange(channel)"
              />
            </div>
            <div>
              <el-button
                type="success"
                size="small"
                @click="moveToChannelManageView(channel)"
              >{{ COMMON.SCHEDULE }}</el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleChannelDeleteClick(channel)"
              >{{ COMMON.DELETE }}</el-button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
<script>

export default {
  props: {
    channelList: {
      required: true,
      type: Array
    },
    isAdmin: {
      required: false,
      type: Boolean,
      default: true
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
    handleNameClick(channel) {
      if (this.isAdmin) {
        this.moveToChannelManageView(channel)
      } else {
        this.viewChannelDetail(channel)
      }
    }
  }
}
</script>
