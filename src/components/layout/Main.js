import Header from './Header';
import {mapGetters} from "vuex";

export default {
  name    : "Main",
  render(h) {
    let header = h(Header, {});

    let content = h('transition', {
      props: {
        name: 'fade-transform',
        mode: 'out-in'
      }
    }, [h('router-view')])

    let main = h('el-main', {
      style: {
        marginTop: '66px'
      }
    }, [content]);

    return h('el-container', {
        props: {
          direction: 'vertical',
        },
        class: 'app-main',
      },
      [
        h('div', {
          class: 'app-content',
          style: {
            // width: `calc(100% - ${this.asideWidth})`
          }
        }, [header,main]),
      ]);
  },
  computed: {
    asideWidth() {
      return this.collapse ? '64px' : '256px';
    },
    ...mapGetters({
      collapse: 'nav/collapse'
    })
  }
};
