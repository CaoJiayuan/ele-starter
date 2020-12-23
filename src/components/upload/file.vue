<template>
  <div class="file-upload-wrapper" :style="{width: this.boxSize}">
    <div @dragover="dragover" @dragenter="dragover" @drop.stop="dropFile" title="点击或拖动文件上传" class="file-upload" :style="{width: this.boxSize, height: this.boxSize}">
      <el-button icon="el-icon-plus" class="uploader-icon" @click="triggerUpload"></el-button>
      <div class="file-preview" v-if="item.preview" >
        <img class="preview-image" :class="this.item.type && this.item.type.indexOf('image') > -1 ? 'clickable' : undefined" :src="item.preview" alt="" @click="previewFile">
      </div>
      <el-progress color="#13ce66" v-if="item.uploading && item.progress < 100" type="circle" :percentage="item.progress"
                   :status="item.error ? 'exception' : undefined"/>

      <el-tooltip placement="right" content="点击移除" v-if="item.done || item.error">
        <i class="el-icon-delete delete-upload" @click="removeFile"></i>
      </el-tooltip>

      <el-dialog :visible.sync="previewOn">
        <img :src="item.preview" alt="" v-if="previewOn" style="width: 100%">
      </el-dialog>
    </div>
    <p class="upload-error" v-if="item.error">{{ file.errorMsg }}</p>
  </div>
</template>

<script>
  // 单文件上传
  import uploadfiles from "@/components/upload/uploadfiles";

  const sizes = {
    small : '32px',
    middle: '64px',
    large : '128px'
  };

  export default {
    name    : "file-upload",
    props   : {
      value: String,
      size : String,
      multifile      : {
        type   : Boolean,
        default: false
      }
    },
    mixins  : [uploadfiles],
    data() {
      return {
        preview: null,
        previewOn: false
      }
    },
    computed: {
      boxSize() {
        let size = this.size || 'large';

        let s = sizes[size];
        if (s) {
          return s;
        }

        return this.size;
      },
      url: {
        get() {
          return this.value;
        },
        set(v) {
          this.$emit('input', v);
        }
      },
      item() {
        if (this.file.valid) {
          return this.file;
        }
        return this.parseValue();
      }
    },
    methods : {
      emitChangeFiles() {
        // do nothing
      },
      onUploaded(file) {
        this.$emit('input', file.url);
        this.$emit('uploaded', file);
      },
      previewFile() {
        if (this.file.type && this.file.type.indexOf('image') > -1) {
          this.previewOn = true
        }
      },
      removeFile() {
        this.file.preview = null
        this.file.progress = 0
        this.file.done = false
        this.file.uploading = false
        this.file.error = false
        this.file.errorMsg = ''
        this.url = null
      },
      parseValue() {
        if (this.value) {
          let partials = this.value.split('.');
          let ext = partials[partials.length - 1];
          let type = 'file'
          if (['png', 'jpg','gif'].indexOf(ext) >= 0) {
            type = 'image/' + ext
          }

          return this.file = {
            type   : type,
            name   : '',
            url    : this.value,
            preview: this.isImageFile(this.value) ? this.value : this.getIconByExtention(ext),
            done   : true,
            valid   : true,
          }
        }
        return this.file
      },
      dropFile(e){
        e.stopPropagation()
        e.preventDefault()
        let file = e.dataTransfer.files[0];
        if (file) {
          this.uploadSingle(file)
        }
      },
      dragover(e) {
        e.stopPropagation()
        e.preventDefault()
      }
    },
    watch: {

    }
  };
</script>

<style scoped lang="scss">
.file-upload-wrapper {
  .file-upload {
    position: relative;
    .uploader-icon {
      height: 100%;
      width: 100%;
      padding: 0 !important;
      border: 1px dashed #d9d9d9;
    }
    img.preview-image,.el-progress {
      position: absolute;
      left: 0;
      height: 100%;
    }
    .file-preview {
      width: 100%;
      height: 100%;
      top: 50%;
      left: 50%;
      position: absolute;
      overflow: hidden;
      border-radius: 4px;
      transform: translate(-50%,-50%);
      img.preview-image {
        width: 100%;
        height: auto;
        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%,-50%);
      }
    }

    .el-progress {
      background-color: rgba(255,255,255,.8);
      height: 100%;
      top: 0;
    }
    .delete-upload {
      position: absolute;
      right: -24px;
      bottom: 0;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .upload-error {
    font-size: 8px;
    text-align: center;
  }
}

</style>
