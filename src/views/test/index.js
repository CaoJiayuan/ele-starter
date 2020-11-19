import './test.sass'
import {spring, styler, value, tween, easing} from 'popmotion'
import MorphCard from '@/components/morph-card'
import request from '@/request'
export default  {
  name: "test",
  data(){
    return {
      boxShow: false,
      width: 256,
      height: 128,
      items: []
    }
  },
  computed: {

  },
  mounted() {
    request({
      method: 'get',
      url: '/articles'
    }).then(res => {
      this.items = res.data.data
    })
  },
  render(h) {

    let children = this.items.map(item => {
      let img = h('img', {
        attrs: {
          src: item.image
        },
        style: {
          width: '100%',
          height: 'auto'
        }
      })


      let header = h('div', {
      }, [img, h('h3', {
        style: {
          padding: '10px'
        }
      }, item.title)])


      let content = h('div', {
        domProps: {
          innerHTML: item.content
        },
        style: {
          padding: '10px'
        },
        slot: 'body'
      })

      let b = h(MorphCard, {
        props: {
          toWidth: 720,
          toHeight: 860,
          fromHeight: 160
        },
      }, [header, content])

      return h('el-col', {
        props: {
          span: 4
        },
        style: {
          marginBottom: '20px'
        }
      }, [b])
    })


    return h('el-container', {}, [
      h('el-row', {
        style: {
          width: '80%',
          margin: '20px'
        },
        props: {
          gutter: 20
        }
      }, children)
    ])
  }
}
