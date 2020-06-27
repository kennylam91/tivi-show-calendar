<template>
  <div>
    <div class="bold mb-2">{{ title }}</div>
    <el-form ref="programCreateForm" :model="programData" label-width="170px" size="small">
      <el-form-item :label="COMMON.NAME">
        <el-input v-model="programData.name">
          <template slot="append">
            <el-button type="primary" @click="searchProgramOnTheMovieDb">Search</el-button>

          </template>
        </el-input>

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
      </el-form-item>

      <el-form-item :label="COMMON.DESCRIPTION">
        <el-input
          v-model="programData.description"
          type="textarea"
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="Trailer">
        <el-input v-model="programData.trailer" />
      </el-form-item>
      <img v-for="item in movieImages" :key="item" :src="item">
      <el-form-item label="Logo">
        <Upload :picture-prop="programData.logo" @uploaded="handleUploaded" />
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
  </div>
</template>
<script>
import { CATEGORIES } from '@/assets/utils/constant'
import Upload from '@/components/upload/Upload'
import { programRankOptions } from '@/assets/utils/constant'
import { mapGetters } from 'vuex'
import { getProgramEnTitle, getProgramNameFromMovieTitle, getRankFromVoteAvg, mapGenre } from '@/assets/utils/index'
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
      movieImages: null

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
      debugger
      this.$store.dispatch('app/searchProgramOnTheMovieDb', {
        movieTitle: getProgramEnTitle(this.programData.name)
      }).then(res => {
        this.searchProgramResult = res
        this.searchResultDialog = true
      })
    },
    handleDialogClose(selectedMovie) {
      if (selectedMovie) {
        this.programData.name = getProgramNameFromMovieTitle(selectedMovie)
        this.programData.description = selectedMovie.overview
        this.programData.rank = getRankFromVoteAvg(selectedMovie.vote_average)
        this.programData.categories = mapGenre(selectedMovie.genre_ids)
        this.$store.dispatch('app/fetchImagesFromTheMovieDb', { movieId: selectedMovie.id })
          .then(data => {
            this.movieImages = data.backdrops.concat(data.posters)
              .filter(image => image.aspect_ratio > 1)
              .map(image => 'https://image.tmdb.org/t/p/w400' + image.file_path)
          })
      }
      this.searchResultDialog = false
    }
  }
}
</script>
