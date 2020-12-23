<template>
  <div class="files-upload" :style="{width: width}">
    <div class="upload-wrapper">
      <div class="upload-items">
        <div v-if="files.length < 1" class="placeholder">
          <p>{{placeholder}}</p>
        </div>

        <div class="upload-item" v-for="(file, index) in items">
          <div class="upload-preview">
            <img class="preview-image" :class="file.type && file.type.indexOf('image') > -1 ? 'clickable' : undefined" :src="file.preview" alt=""
                 @click="previewImg(file)"
                 v-if="file.preview">
            <i class="el-icon-warning" v-if="file.error"></i>
          </div>
          <div class="upload-item-content">
            <p class="upload-file-name">{{ file.name }}</p>
            <el-progress  color="#13ce66" :percentage="file.progress"
                         v-if="file.uploading && !file.error"
                         :status="file.error ? 'exception' : undefined"/>
            <p class="upload-error" v-if="file.error">{{ file.errorMsg }}</p>
            <el-tooltip class="file-remove" placement="right" content="点击移除" v-if="file.done || file.error">
              <i class="el-icon-delete clickable"  @click="removeUploadFile(index)"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="previewOn">
      <img :src="preview" alt="" v-if="previewOn" style="width: 100%">
    </el-dialog>
    <div @dragover="dragover" @dragenter="dragover" @drop.stop="dropFile" title="点击或拖动文件上传">
      <el-button  type="text" class="upload-trigger" @click="triggerUpload" size="small">+ 选择文件</el-button>
    </div>
  </div>
</template>

<script>

  import uploadfiles from "@/components/upload/uploadfiles";

  export default {
    name : "files-upload",
    props: {
      width: {
        type: String,
        default: '512px'
      },
      placeholder: {
        type: String,
        default: '未选择文件'
      },
    },
    mixins: [uploadfiles],
    data() {
      return {
        previewOn: false,
        preview: null
      }
    },
    methods: {
      previewImg({preview, type, url}) {
        if(type && type.indexOf('image') > -1) {
          this.previewOn = true
          this.preview = url || preview
        }
      },
      dropFile(e){
        e.stopPropagation()
        e.preventDefault()
        let files = e.dataTransfer.files;
        let length = files.length;
        for (let i = 0; i < length; i++) {
          this.uploadSingle(files[i]);
        }
      },
      dragover(e) {
        e.stopPropagation()
        e.preventDefault()
      }
    }
  };
</script>

<style scoped lang="scss">
.files-upload {
  position: relative;
  background-color: #eeeeee;

  .upload-wrapper {
    min-height: 89px;
    max-height: 256px;
    overflow-y: scroll;
    .placeholder {
      text-align: center;
      color: gray;
    }
    .upload-items {
      padding: 6px;
      .upload-item {
        padding: 6px;
        background-color: #ffffff;
        margin: 6px 0;
        height: 76px;
        line-height: 76px;
        border-radius: 6px;
        display: flex;
        .upload-preview {
          position: relative;
          width: 76px;
          overflow: hidden;
          i {
            color: red;
            font-size: 20px;
          }
          .preview-image {
            position: absolute;
            width: 100%;
            margin-top: 5px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .upload-item-content {
          width: 100%;
          position: relative;
          padding-left: 8px;
          .el-progress {
            width: 86%;
          }
          .upload-file-name {
            height: 52px;
            line-height: 52px;
          }
          .upload-error {
            height: 12px;
            line-height: 12px;
            color: red;
          }
          .file-remove {
            display: none;
          }
          .el-icon-delete {
            float: right;
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 24px;
            color: red;
          }
        }
        &:hover .file-remove {
          display: block;
        }
      }
    }
  }
  .upload-trigger {
    width: 100%;
    box-shadow:0 -1px 2px -2px #5a5e66;
    left: 0;
    bottom: 0;
  }
}
</style>
