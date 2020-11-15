<template>
  <div>
    <div class="justify-between-align-center mb-2">
      <div class="bold ">{{ title }}</div>
      <el-button type="primary" size="small" @click="onSubmit">{{ COMMON.SUBMIT }}</el-button>
    </div>
    <el-form ref="programCreateForm" :model="programData" label-width="170px" size="small" @keyup.enter.prevent>
      <el-form-item :label="COMMON.NAME">
        <el-input v-model="programData.name" />
      </el-form-item>
      <el-form-item label="EnName">
        <el-input v-model="programData.enName" @blur="checkNameExist">
          <template slot="append">
            <el-button
              :disabled="!programData.enName"
              type="primary"
              @click="searchProgramOnTheMovieDb"
            >Search</el-button>
          </template>
        </el-input>
        <div v-if="foundPrograms">
          <span v-for="(prog) in foundPrograms" :key="prog.id">
            {{ prog.name }} - {{ prog.enName }}
          </span>
          <span v-if="foundPrograms.length === 0">Not found this name</span>
        </div>
      </el-form-item>

      <el-form-item label="Year">
        <el-input v-model="programData.year" />
      </el-form-item>
      <el-form-item :label="COMMON.CATEGORY">
        <el-select
          v-model="programData.categoryCodes"
          multiple
          class="w-100"
          :placeholder="COMMON.SELECT_CATEGORY"
          size="small"
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.code"
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
          :rows="3"
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
        <el-input v-model="programData.logo" placeholder="Logo" />

        <div class="flex">
          <Upload :picture-prop="programData.logo" @uploaded="handleUploaded" />
          <el-button type="primary" @click="movieImagesDialogVisible = true">Choose Image</el-button>

        </div>
      </el-form-item>
      <el-form-item>
        <img :src="programData.logo">
      </el-form-item>
    </el-form>
    <ProgramSearchResultDialog
      v-if="searchProgramResult"
      :visible-prop="searchResultDialog"
      :search-result-prop="searchProgramResult"
      @close="handleDialogClose"
    />
    <el-dialog
      :key="dialogKey"
      title="Choose logo"
      :visible.sync="movieImagesDialogVisible"
      width="50%"
      destroy-on-close
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
      v-if="trailerList"
      :key="dialogKey"
      title="Choose trailer"
      :visible.sync="trailerDialogVisible"
      width="70%"
      destroy-on-close
    >
      <el-table
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
            <div v-if="row.id" class="embed-responsive embed-responsive-16by9">
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
import { getProgramEnTitle, getRankFromVoteAvg, mapGenre, getEmbedLinkFromYoutubeVideoId } from '@/assets/utils/index'
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
      trailerList: null,
      trailerDialogVisible: false,
      voteAvg: 0,
      dialogKey: 0,
      foundPrograms: null
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
      channelList: 'channelList',
      categories: 'categories'
    })

  },
  watch: {
    programProp: {
      immediate: true,
      handler() {
        this.programData = { ...this.programProp,
          name: this.programProp.name.toUpperCase(),
          enName: this.programProp.enName.toUpperCase() }
      }
    }
  },
  created() {
    if (!this.categories) {
      this.$store.dispatch('app/fetchCategories', {})
    }
  },
  methods: {
    handleImageDgClose() {
      this.movieImagesDialogVisible = false
    },
    onSubmit() {
      this.$store.dispatch('app/createOrUpdateProgram', this.programData).then(() => {
        this.$notify({
          title: 'Program Saved',
          type: 'success',
          duration: '4500',
          position: 'bottom-right'
        })
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
        this.dialogKey++
        this.foundPrograms = null
        this.$emit('saved')
      })
    },

    handleUploaded(picture) {
      this.programData.logo = picture
    },
    searchProgramOnTheMovieDb() {
      console.log('searchProgramOnTheMovieDb')
      this.$store.dispatch('app/searchProgramOnTheMovieDb', {
        movieTitle: getProgramEnTitle(this.programData.enName)
      }).then(res => {
        this.searchProgramResult = res
        this.searchResultDialog = true
      })
    },
    handleDialogClose(selectedMovie) {
      if (selectedMovie) {
        if (selectedMovie.overview) {
          this.programData.description = selectedMovie.overview
        }
        this.programData.enName = selectedMovie.original_title.toUpperCase()
        this.programData.name = (selectedMovie.title + '').toUpperCase()
        this.voteAvg = selectedMovie.vote_average
        this.programData.rank = getRankFromVoteAvg(selectedMovie.vote_average)
        this.programData.categoryCodes = mapGenre(selectedMovie.genre_ids)
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
    checkNameExist() {
      const data = { searchName: this.programData.enName.toUpperCase(), page: 1, limit: 999 }
      if (this.programData.enName) {
        this.$store.dispatch('app/searchProgram', data).then(res => {
          this.foundPrograms = res.content
        })
      }
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
            'q': getProgramEnTitle(this.programData.enName) + ' trailer'
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
