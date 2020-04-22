<template>
  <div>
    <div>
      <p>Upload an image to Firebase:</p>
      <input type="file" accept="image/*" @change="previewImage"></div>
    <div v-if="uploading">
      <p>Progress: {{ uploadValue.toFixed()+"%" }}
        <progress id="progress" :value="uploadValue" max="100" />  </p>
    </div>
    <div v-if="picture">
      <img height="200" :src="picture">
    </div>
    <el-button type="danger" size="mini" plain @click="onUpload">Upload</el-button>

  </div>
</template>
<script>
import { firebase } from '@/FireBase'
export default {
  props: {
    pictureProp: {
      required: false,
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageData: null,
      picture: null,
      uploadValue: 0,
      uploading: false
    }
  },
  watch: {
  },
  created() {
    this.picture = this.pictureProp
  },
  methods: {
    previewImage(event) {
      this.uploadValue = 0
      this.picture = null
      this.imageData = event.target.files[0]
    },
    onUpload() {
      this.uploading = true
      this.picture = null
      var metadata = {
        contentType: 'image/jpeg'
      }
      const storageRef = firebase.storage().ref(`images/${this.imageData.name}`).put(this.imageData, metadata)
      storageRef.on(`state_changed`, snapshot => {
        this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      }, error => { console.log(error.message) },
      () => {
        this.uploadValue = 100
        storageRef.snapshot.ref.getDownloadURL().then((url) => {
          this.picture = url
          this.$emit('uploaded', this.picture)
        })
      }
      )
    }
  }
}
</script>
