import {upload, UploadFile} from 'nerio-uploader';
import {UploadDriver, UploadOssStsUrl} from "@/constants/upload";

export default {
  data() {
    return {
      defaultUploadDriver: UploadDriver,
      defaultOptions: {
        stsUrl     : UploadOssStsUrl,
       }
    }
  },
  methods: {
    uploadFile(file, options = {}) {
      options = Object.assign(this.defaultOptions, options)

      return upload(file, this.defaultUploadDriver, options)
    }
  }
}
