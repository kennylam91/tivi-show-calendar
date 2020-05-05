<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" width="270" fixed clipped app>
      <v-list>
        <v-list-item link @click="$router.push({ path: '/' })">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ COMMON.HOMEPAGE }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="moveToChannelListView">
          <v-list-item-action>
            <v-icon>mdi-ballot</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ COMMON.CHANNEL_LIST }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          :prepend-icon="channelMenu.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="channelMenu.title" />
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="subItem in channelMenu.items"
            :key="subItem.title"
            link
            @change="handleChange(subItem.title)"
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="primary" dense fixed clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-icon class="mx-3">
        mdi-youtube
      </v-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">Youtube</span>
      </v-toolbar-title>
      <v-spacer />
      <v-layout row align-center style="max-width: 650px">
        <v-text-field
          placeholder="Search..."
          single-line
          append-icon="mdi-magnify"
          color="white"
          hide-details
        />
      </v-layout>
    </v-app-bar>
    <v-content>
      <Nuxt class="container" style="margin-top: 60px;" />
    </v-content>
  </v-app>
</template>

<style scoped>
</style>

<script>
import { mapGetters } from 'vuex'
import { COMMON } from '@/assets/utils/constant'
export default {
  data() {
    return {
      drawer: true,
      channelMenu: {
        icon: 'mdi-calendar-clock',
        title: COMMON.SCHEDULE,
        items: []
      },
      items: [
        {
          action: 'mdi-play-box-outline',
          title: COMMON.PROGRAM,
          items: [
            { title: COMMON.TODAY },
            { title: COMMON.NEXT_DAY }
          ]
        }

      ],
      pathIndexMatrix: null,
      pathIndexMap: null
    }
  },
  computed: {
    ...mapGetters({
      channelList: 'channelList',
      todayProgramList: 'todayProgramList',
      nextDaysProgramList: 'nextDaysProgramList',
      fromNowInDayProgramList: 'fromNowInDayProgramList',
      fromNowInDayScheduleList: 'fromNowInDayScheduleList',
      fromTodayProgramList: 'fromTodayProgramList'

    }),
    vipChannelList() {
      return this.channelList.filter(channel => channel.isVip === true)
    }
  },
  watch: {
  },
  created() {
    this.pathIndexMatrix = []
    for (const channel of this.vipChannelList) {
      this.channelMenu.items.push({ title: channel.name })
      const name = channel.name.split(' ').join('-').trim()
      const channelPath = `/lich-chieu/${name}_${channel.id}`
      this.pathIndexMatrix.push([channel.name, channelPath])
    }
    this.pathIndexMap = new Map(this.pathIndexMatrix)
  },
  methods: {
    handleChange(value) {
      const path = this.pathIndexMap.get(value)
      this.$router.push({ path: path })
    }
  }
}
</script>
