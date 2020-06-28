<template>
  <div>
    <div class="bold mb-2">{{ title }}</div>
    <el-form ref="programCreateForm" :model="programData" label-width="170px" size="small" @keyup.enter.prevent>
      <el-form-item :label="COMMON.NAME">
        <el-input v-model="programData.name" @change="searchProgramOnTheMovieDb">
          <template slot="append">
            <el-button :disabled="!programData.name" type="primary" @click="searchProgramOnTheMovieDb">Search</el-button>
          </template>
        </el-input>
        {{ suggesstionMovieName }}
      </el-form-item>
      <el-form-item label="Year">
        <el-input v-model="programData.year" />
      </el-form-item>
      <el-form-item :label="COMMON.CHANNEL">
        <el-select
          v-model="programData.channels"
          multiple
          class="w-100"
        >
          <el-option
            v-for="item in channelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />

        </el-select>
      </el-form-item>
      <el-form-item :label="COMMON.CATEGORY">
        <el-select
          v-model="programData.categories"
          multiple
          class="w-100"
          :placeholder="COMMON.SELECT_CATEGORY"
          size="small"
        >
          <el-option
            v-for="item in CATEGORIES"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            class="small-font-size"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="COMMON.RANK">
        <div class="flex">
          <el-select
            v-model="programData.rank"
            class="w-100"
            size="small"
          >
            <el-option
              v-for="item in programRankOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />

          </el-select>
          <span class="block bold mx-4">{{ voteAvg }}</span>
        </div>
      </el-form-item>

      <el-form-item :label="COMMON.DESCRIPTION">
        <el-input
          v-model="programData.description"
          type="textarea"
          :rows="5"
        />
      </el-form-item>
      <el-form-item label="Trailer">
        <el-input v-model="programData.trailer">
          <template slot="append">
            <el-button :disabled="!programData.name" type="primary" @click="searchTrailer">Search Trailer</el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="Logo">
        <div class="flex">
          <Upload :picture-prop="programData.logo" @uploaded="handleUploaded" />
          <el-button type="primary" @click="movieImagesDialogVisible = true">Choose Image</el-button>

        </div>
      </el-form-item>
      <el-form-item>
        <img :src="programData.logo">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{ COMMON.SUBMIT }}</el-button>
        <el-button type="info" @click="handleCancelClick">{{ COMMON.CANCEL }}</el-button>
      </el-form-item>
    </el-form>
    <ProgramSearchResultDialog
      v-if="searchProgramResult"
      :visible-prop="searchResultDialog"
      :search-result-prop="searchProgramResult"
      @close="handleDialogClose"
    />
    <el-dialog
      title="Choose logo"
      :visible.sync="movieImagesDialogVisible"
      width="50%"
    >
      <el-table
        v-if="movieImages"
        height="700"
        :data="movieImages"
        highlight-current-row
        border
        stripe
        size="small"
        @current-change="handleSelectImage"
      >
        <el-table-column label="Image">
          <template slot-scope="{row}">
            <img height="150" :src="row">
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
    <el-dialog
      title="Choose trailer"
      :visible.sync="trailerDialogVisible"
      width="70%"
    >
      <el-table
        v-if="trailerList"
        height="700"
        :data="trailerList"
        highlight-current-row
        border
        stripe
        size="small"
        @current-change="handleSelectTrailer"
      >
        <el-table-column label="Trailer">
          <template slot-scope="{row}">
            {{ row.snippet.title }}
          </template>
        </el-table-column>
        <el-table-column width="400">
          <template slot-scope="{row}">
            <div class="embed-responsive embed-responsive-16by9">
              <span v-html="getEmbedLinkFromYoutubeVideoId(row.id.videoId)" />
            </div>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>

  </div>
</template>
<script>
import { CATEGORIES } from '@/assets/utils/constant'
import Upload from '@/components/upload/Upload'
import { programRankOptions } from '@/assets/utils/constant'
import { mapGetters } from 'vuex'
import { getProgramEnTitle, getProgramNameFromMovieTitle, getRankFromVoteAvg, mapGenre, getEmbedLinkFromYoutubeVideoId } from '@/assets/utils/index'
import ProgramSearchResultDialog from './ProgramSearchResultDialog'

export default {
  components: { Upload, ProgramSearchResultDialog },
  props: {
    programProp: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      programData: null,
      CATEGORIES,
      programRankOptions,
      searchProgramResult: null, // search from themoviedb
      searchResultDialog: false,
      movieImages: null,
      movieImagesDialogVisible: false,
      suggesstionMovieName: null,
      trailerList: null,
      trailerDialogVisible: false,
      voteAvg: 0

    }
  },
  computed: {
    title() {
      if (this.programProp.id) {
        return 'Update Program'
      } else {
        return 'Create Program'
      }
    },
    ...mapGetters({
      channelList: 'channelList'
    })

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
    handleImageDgClose() {
      this.movieImagesDialogVisible = false
    },
    onSubmit() {
      if (!this.programData.id) {
        this.$store.dispatch('app/createProgram', this.programData).then(() => {
          this.$notify({
            title: 'Program Created',
            type: 'success',
            duration: '4500',
            position: 'bottom-right'
          })
          this.$emit('saved')
          this.programData = {
            id: '',
            name: '',
            description: '',
            logo: '',
            isTodayShow: true,
            isNextDaysShow: true,
            categories: null,
            rank: 1
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$store.dispatch('app/updateProgram', this.programData).then(() => {
          this.$notify({
            title: 'Program Updated',
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
    handleCancelClick() {
      this.$emit('cancel')
    },
    handleUploaded(picture) {
      this.programData.logo = picture
    },
    searchProgramOnTheMovieDb() {
      console.log('searchProgramOnTheMovieDb')
      this.$store.dispatch('app/searchProgramOnTheMovieDb', {
        movieTitle: getProgramEnTitle(this.programData.name)
      }).then(res => {
        this.searchProgramResult = res
        this.searchResultDialog = true
      })
    },
    handleDialogClose(selectedMovie) {
      if (selectedMovie) {
        this.suggesstionMovieName = getProgramNameFromMovieTitle(selectedMovie)
        if (selectedMovie.overview) {
          this.programData.description = selectedMovie.overview
        }
        this.voteAvg = selectedMovie.vote_average
        this.programData.rank = getRankFromVoteAvg(selectedMovie.vote_average)
        this.programData.categories = mapGenre(selectedMovie.genre_ids)
        this.programData.year = selectedMovie.release_date.split('-')[0]
        this.$store.dispatch('app/fetchImagesFromTheMovieDb', { movieId: selectedMovie.id })
          .then(data => {
            this.movieImages = data.backdrops.concat(data.posters)
              .filter(image => image.aspect_ratio > 1)
              .map(image => 'https://image.tmdb.org/t/p/w400' + image.file_path)
          })
      }
      this.searchResultDialog = false
    },
    handleSelectImage(selectedImage) {
      console.log(selectedImage)
      this.programData.logo = selectedImage
    },
    searchTrailer() {
      console.log('searchTrailer')
      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get()

      if (!isSignedIn) {
        gapi.auth2.getAuthInstance().signIn().then(() => {
          this.searchYoutube()
        })
      } else {
        this.searchYoutube()
      }
    },
    searchYoutube() {
      gapi.client.load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
        .then(() => {
          gapi.client.youtube.search.list({
            'part': [
              'snippet'
            ],
            'maxResults': 10,
            'q': getProgramEnTitle(this.programData.name) + ' trailer'
          }).then(({ result }) => {
            this.trailerList = result.items.map(item => item)
            this.trailerDialogVisible = true
          }).catch(err => {
            this.$message({
              message: err,
              type: 'error',
              showClose: true
            })
          })
        })
    },
    getEmbedLinkFromYoutubeVideoId(videoId) {
      return getEmbedLinkFromYoutubeVideoId(videoId)
    },
    handleSelectTrailer(val) {
      this.programData.trailer = this.getEmbedLinkFromYoutubeVideoId(val.id.videoId)
    }

  }

}
</script>
