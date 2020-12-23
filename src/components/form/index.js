import './form.sass'

import request from '@/request'

export default {
  name   : 'DataForm',
  props  : {
    value: Object,
    url: String,
    method: {
      type: String,
      default: 'post'
    }
  },
  computed: {
    formValue: {
      get(){
        return this.value
      },
      set(v) {
        this.$emit('input', v)
      }
    }
  },
  render(h) {
    let content = this.$slots.default || [];

    if (this.$slots.submitter) {
      let submit = h('div', {
        on: {
          click: e => {
            this.submit().then(res => {
              this.$emit('submitted', res)
            })
          }
        },
        style: {
          display: 'inline-block',
        }
      }, this.$slots.submitter);

      let submitWrap = h('el-form-item', {
        style: {
          marginBottom: '12px'
        }
      }, [submit])

      content = [...content, submitWrap]
    }

    return h('el-form', {
      attrs: this.$attrs,
      ref: 'form',
      props: {
        model: this.formValue,
      },
      on: {
        input: v => this.formValue = v
      }
    }, content);
  },
  methods: {
    reset() {
      this.formValue = {}
      this.$refs.form.resetFields()
    },
    submit(){
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            return request({
              url: this.url,
              method: this.method,
              data: this.formValue
            }).then(res => {
              this.$notify.success('保存成功')
              return resolve(res);
            }).catch(reject)
          } else {
            // reject('validation error')
            return false;
          }
        });
      })


    },
    validateField(field) {
      this.$refs.form.validateField(field);
    }
  }
};
