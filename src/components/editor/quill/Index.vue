<template>
  <div class="quill-wrapper">
    <div class="quill-container">
      <quill-editor ref="editor" v-model="contentValue" :options="options">
        <div slot="toolbar" :id="editorToolbar">
      <span class="ql-formats">
        <select class="ql-header">
        <option value="1">一级标题</option>
        <option value="2">二级标题</option>
        <option value="3">三级标题</option>
        <option value="4">四级标题</option>
        <option value="5">五级标题</option>
        <option value="6">六级标题</option>
        <option selected="selected">正文</option>
      </select>
      <select name="size" class="ql-size">
        <option value="small">小</option>
        <option selected>中</option>
        <option value="large">大</option>
        <option value="huge">很大</option>
        <!--<option :value="s" v-for="s in sizes">{{s}}</option>-->
      </select>
      </span>
          <span class="ql-formats">
         <select class="ql-color" title="'Char color'">
        </select>
        <select class="ql-background" title="'Bg color'">
        </select>
      </span>
          <span class="ql-formats">
        <button type="button" class="ql-bold">
          <strong>B</strong>
        </button>
        <button type="button" class="ql-italic"></button>
        <button type="button" class="ql-underline"></button>
         <select class="ql-align">
            <option selected=""></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
         <button type="button" class="ql-strike"></button>
            <!--<button class="ql-indent" @click="indent = !indent"><i class="fa fa-indent" style="font-size: 16px"></i></button>-->
      </span>
          <span class="ql-formats">
        <button type="button" class="ql-blockquote"></button>
        <button type="button" class="ql-code-block"></button>
      </span>
          <span class="ql-formats">
        <button type="button" class="ql-header" value="1"></button>
        <button type="button" class="ql-header" value="2"></button>
      </span>
          <span class="ql-formats">
        <button type="button" class="ql-list" value="ordered"></button><button type="button" class="ql-list"
                                                                               value="bullet"></button>
      </span>
          <span class="ql-formats">
        <button type="button" class="ql-script" value="sub"></button><button type="button" class="ql-script"
                                                                             value="super"></button>
      </span>
          <span class="ql-formats">
        <button type="button" class="ql-indent" value="-1"></button><button type="button" class="ql-indent"
                                                                            value="+1"></button>
      </span>
          <span class="ql-formats">
        <button type="button" class="ql-direction" value="rtl"></button>
      </span>
          <span class="ql-formats upload-img" style="position: relative;">
        <button type="button" class="ql-image">
        </button>
        <input accept="image/*" type="file" style="display: none;" ref="upload" @change="upload">
          <el-progress
            :width="24"
            color="lime"
            class="progress"
            :percentage="imgProgress"
            v-if="imgUploading"
            type="circle"
            :show-text="false"
          >
          </el-progress>
      </span>
        </div>
      </quill-editor>
    </div>
  </div>
</template>

<script>
  import {quillEditor} from 'vue-quill-editor';
  import {upload, UploadFile} from 'nerio-uploader';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import {functions} from 'nerio-js-utils';
  import ImageResize from '@/libs/quill-image-resize/src/ImageResize';
  import Quill from 'quill';

  const SizeStyle = Quill.import('attributors/style/size');
  SizeStyle.whitelist = ['8px', '10px', '12px', '14px', '16px', '18px', '20px', '22px', 'large', 'small', 'huge'];
  Quill.register('modules/imageResize', ImageResize);
  Quill.register(SizeStyle, true);
  const {fastRandom} = functions;

  export default {
    name      : 'quill',
    props     : {
      value  : String,
      content: {
        type   : String,
        default: () => ''
      }
    },
    data() {
      return {
        uploadDriver : 'oss',
        quill        : null,
        imgProgress  : -1,
        videoProgress: -1,
        sizes        : SizeStyle.whitelist
      };
    },
    components: {quillEditor},
    methods   : {
      imgHandler(state) {
        if (state) {
          this.$refs.upload.value = null;
          this.$refs.upload.click();
        }
      },
      upload(e) {
        let file = e.target.files[0];
        if (file) {
          upload(file, this.uploadDriver, {
            validate: (uploadFile) => {
              if (!uploadFile.isImage()) {
                return false;
              }
              if (!uploadFile.notExceeding(10 * UploadFile.MB)) {
                uploadFile.invalidFileMessage = '图片大小不能超过10M';
                return false;
              }
              return true;
            },
            stsUrl     : '/sts',
            progress: percent => {
              this.imgProgress = percent;
            },
            chunk   : false
          }).then(file => {
            let url = file.url.split('?', 2)[0];
            if (this.quill) {
              let range = this.quill.getSelection();
              this.quill.insertEmbed(range !== null ? range.index : 0, 'image', url, Quill.sources.USER);
            }
            this.imgProgress = -1;
          });
        }
      },
      uploadVideo(e) {
        let file = e.target.files[0];
        if (file) {
          upload(file, this.uploadDriver, {
            validate: (uploadFile) => {
              return uploadFile.isVideo();
            },
            progress: percent => {
              this.videoProgress = percent;
              console.log(percent);
            },
            chunk   : false,
          }).then(file => {
            let url = file.url.split('?', 2)[0];
            if (this.quill) {
              let range = this.quill.getSelection();
              this.quill.insertEmbed(range !== null ? range.index : 0, 'video', url, 'user');
            }
            this.videoProgress = -1;
          });
        }
      }
    },
    mounted() {
      this.quill = this.$refs.editor.quill;
      this.quill.getModule('toolbar').addHandler('image', this.imgHandler);
    },
    computed  : {
      contentValue: {
        get() {
          return this.value;
        },
        set(v) {
          this.$emit('input', v);
        }
      },
      imgUploading() {
        return this.imgProgress > -1 && this.imgProgress < 100;
      },
      videoUploading() {
        return this.videoProgress > -1 && this.videoProgress < 100;
      },
      editorToolbar() {
        return 'editor-toolbar-' + fastRandom();
      },
      options() {
        return {
          modules    : {
            toolbar    : '#' + this.editorToolbar,
            imageResize: {
              modules: ['Resize', 'DisplaySize']
            }
          },
          placeholder: '请输入内容'
        };
      }
    },
  };
</script>
<style lang="sass">
  .quill-wrapper
    display: inline-block

  .quill-container
    height: 100%
    .quill-editor
      display: inline

      strong, h1, h2, h3, h4, h5, h6
        font-weight: bolder !important

    .upload-img
      position: relative

      .progress
        position: absolute
        left: 2px
        background-color: rgba(161, 161, 161, 0.43)
        border-radius: 100%

    .upload-video
      .el-progress
        position: absolute
        left: 0

      button
        svg
          fill: black

        &:hover svg
          fill: #6767f4

        &:active
          border: none
</style>
