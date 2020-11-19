export default {
  name: 'Container',
  props: {
  },
  render(h) {
    return h('el-row', {}, [
      h('el-col', {
        props: {
          xl: {
            span: 16,
            offset: 4
          },
          lg: {
            span: 22,
            offset: 1
          },
          md: {
            span: 24
          },
        }
      }, this.$slots.default)
    ])
  }
}
