import {upload, UploadFile} from 'nerio-uploader';
import {UploadDriver, UploadOssStsUrl} from "@/constants/upload";


export default {
  props   : {
    uploadUrl      : {
      type   : String,
      default: '/upload'
    },
    uploadDriver   : {
      type   : String,
      default: UploadDriver
    },
    uploadValidator: {
      type   : Function,
      default: undefined
    },
    accept         : {
      type   : String,
      default: '*/*'
    },
    stsUrl         : {
      type   : String,
      default: UploadOssStsUrl
    },
    chunk          : Boolean,
    fileResolver   : {
      type   : Function,
      default: file => {
        return {
          filename: file.name,
          type: file.type,
          url : file.url,
        };
      }
    },
    value          : {
      type   : Array,
      default: () => []
    },
    chunkSize      : {
      type   : Number,
      default: 256 * UploadFile.KB
    },
    multifile      : {
      type   : Boolean,
      default: true
    }
  },
  methods : {
    triggerUpload() {
      this.uploadInput.click();
    },
    doUpload(e) {
      let length = e.target.files.length;
      if (!this.multifile) {
        length = length > 0 ? 1 : 0;
        this.files = [];
      }
      for (let i = 0; i < length; i++) {
        this.uploadSingle(e.target.files[i]);
      }
    },
    /**
     *
     * @param {File} file
     */
    uploadSingle(file) {
      let uploadFile = new UploadFile(file);
      let extension = uploadFile.getExtension();
      let icon = this.getIconByExtention(extension);
      let f
      if (!this.multifile) {
        f = this.file
      } else {
        f = {
          progress : 0,
          url      : null,
          error    : false,
          errorMsg : '',
          done     : false
        }
      }
      f.valid = true
      f.name = file.name
      f.uploading = true
      f.type = file.type
      f.preview = null
      f.error = false
      f.errorMsg = ''

      this.files.push(f);

      if (uploadFile.isImage()) { // image preview has issues with mockjs
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = e => {
          f.preview = e.target.result;
        };
      } else {
        f.preview = icon;
      }

      upload(file, this.uploadDriver, {
        validate : this.getUploadValidator(),
        chunk    : this.chunk,
        stsUrl   : this.stsUrl,
        progress : percent => f.progress = percent,
        chunkSize: this.chunkSize,
        url      : this.uploadUrl
      }).then(data => {
        f.url = data.url.split('?', 2)[0];
        f.percent = 100;
        f.done = true;
        f.uploading = false;
        this.onUploaded(f);
        this.emitChangeFiles();
      }).catch(error => {
        f.error = true;
        f.errorMsg = error.message;
      });
    },
    emitChangeFiles() {
      this.$emit('input', this.resolveUploadFiles(this.files));
      if (this.files.length < 1) {
        this.clearFiles()
      }
    },
    onUploaded(file) {
      this.$emit('uploaded', file);
    },
    clearFiles() {
      this.uploadInput.value = ''
    },
    getUploadValidator() {
      if (this.uploadValidator) {
        return this.uploadValidator;
      }
      if (this.accept && this.accept !== '*/*') {
        return uploadFile => {
          let reg = new RegExp(this.accept.replace('*', '.*'));
          return reg.test(uploadFile.file.type);
        };
      }
      return uploadFile => true;
    },
    resolveUploadFiles(files) {
      return files.map(file => this.fileResolver(file));
    },
    removeUploadFile(index) {
      this.files.splice(index, 1);
      this.emitChangeFiles();
    },
    bind() {
      this.uploadInput.addEventListener('change', this.doUpload);
    },
    unbind() {
      this.uploadInput.removeEventListener('change', this.doUpload);
    },
    parseValue() {

      return this.value.map(v => {
        return {
          type   : v.type,
          name   : v.filename,
          url    : v.url,
          preview: this.isImageFile(v.url) ? v.url : this.getIconByExtention(ext),
          done   : true
        };
      });
    },
    getIconByExtention(extension) {
      let icon;
      if (this.knownFileTypes.indexOf(extension) > -1) {
        icon = this.fileIconsDir + extension + '.svg';
      } else {
        icon = this.fileIconsDir + 'file.svg';
      }
      return icon;
    },
    isImageFile(filename) {
      let partials = filename.split('.');

      let ext = partials[partials.length - 1];

      return this.imageExts.filter(ext => {
        return ext.toLowerCase() === ext.toLowerCase()
      }).length > 0
    }
  },
  computed: {
    uploadInput() {
      if (this.fileEl === null) {
        this.fileEl = document.createElement('input');
        this.fileEl.type = 'file';
        this.fileEl.multiple = this.multifile;
        this.fileEl.accept = this.accept;
        // document.body.appendChild(this.fileEl);
      }

      return this.fileEl;
    },
    items() {
      if (this.files.length > 0) {
        return this.files;
      }
      this.files = this.parseValue();

      return this.files;
    }
  },
  data() {
    return {
      fileEl        : null,
      files         : [],
      knownFileTypes: [
        'aep',
        'ai',
        'audition',
        'avi',
        'bridge',
        'css',
        'csv',
        'dbf',
        'doc',
        'dreamweaver',
        'dwg',
        'exe',
        'file',
        'fireworks',
        'fla',
        'flash',
        'html',
        'illustrator',
        'indesign',
        'iso',
        'javascript',
        'jpg',
        'jpeg',
        'json-file',
        'mp3',
        'mp4',
        'pdf',
        'photoshop',
        'png',
        'ppt',
        'prelude',
        'premiere',
        'psd',
        'rtf',
        'search',
        'svg',
        'txt',
        'xls',
        'xlsx',
        'xml',
        'zip-1',
        'zip'
      ],
      fileIconsDir  : '/images/filetypes/',
      file: { //current file
        progress: 0,
        url     : null,
        error   : false,
        errorMsg: '',
        done    : false,
        uploading: false,
        valid: false,
      },
      imageExts: ['png', 'jpg', 'jpeg']
    };
  },
  mounted() {
    this.bind();
  },
  beforeDestroy() {
    this.unbind();
  }
};
