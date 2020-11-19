import './card.sass';
import {spring, styler, value} from 'popmotion';
import fa from "element-ui/src/locale/lang/fa";

export default {
  name    : "MorphCard",
  props   : {
    toWidth   : Number,
    toHeight  : Number,
    fromHeight: Number,
    toY       : Number
  },
  data() {
    return {
      initialValue: null,
      changed     : false,
      showBody    : false,
      coverId : 'morph-cover-1534'
    };
  },
  computed: {
    bodyDimension() {
      let s = styler(document.body);

      return {width: s.get('width'), height: s.get('height')};
    }
  },
  render(h) {
    if (this.$slots.default && this.$slots.default.length > 0) {
      let children = this.$slots.default;

      if (this.showBody && this.changed) {
        let closeButton = h('el-button', {
          props: {
            circle: true,
            icon  : 'el-icon-close',
            size  : 'mini',
          },
          style: {
            position: 'absolute',
            top     : '6px',
            right   : '6px'
          },
          on   : {
            click: this.close
          }
        });
        children = [...this.$slots.default, this.$slots.body, closeButton];
      }

      let content = h('el-card', {
        style: {
          width : '100%',
          height: this.showBody ? `${this.toHeight}px` : `${this.fromHeight}px`,
          overflowY: 'scroll',
          borderRadius: '12px'
        },
        props: {
          bodyStyle: {
            padding: 0
          }
        }
      }, children);


      let container = h('div', {
        ref  : 'container',
        style: {
          position: this.showBody ? 'fixed' : 'static',
          zIndex  : this.showBody ? 1000 : 0,
        },
        props: {},
        on   : {
          click: this.open
        },
      }, [content]);

      return h('div', {
        style: {
          width : '100%',
          height: `${this.fromHeight}px`,
        }
      }, [container])
    }
  },
  methods : {
    getContainerValue() {
      let stylerBox = styler(this.$refs.container);
      let cWidth = stylerBox.get('width');

      return value({
        width : cWidth,
        height: stylerBox.get('height'),
        x     : stylerBox.get('x'),
        y     : stylerBox.get('y'),
      }, stylerBox.set);
    },
    getContainerOffset() {
      let rect = this.$refs.container.getBoundingClientRect();
      let docEl = document.documentElement;
      return {
        left: rect.left + (window.pageXOffset || docEl.scrollLeft || 0),
        top: rect.top + (window.pageYOffset || docEl.scrollTop || 0)
      };
    },
    animate(startValue, to) {
      return new Promise(resolve => {
        spring({
          from     : startValue.get(),
          to       : to,
          stiffness: 80,
          damping  : 30,
          restDelta: 2,
          restSpeed: 2
        }).start({
          update  : v => startValue.update(v),
          complete: resolve
        });
      });
    },
    open(e) {
      e.stopPropagation();
      if (this.showBody) {
        return;
      }
      let offset = this.getContainerOffset()

      let val = this.getContainerValue();
      let {width} = this.bodyDimension;

      let cWidth = val.get().width;
      let cHeight = val.get().height;
      let cX = offset.left;
      let cY = offset.top;
      let toWidth = this.toWidth || cWidth;
      let toHeight = this.toHeight || cHeight;
      let toY = this.toY || 20;


      this.initialValue = value(val.get());
      this.showBody = true;
      this.cover(true)

      this.animate(val, {width: toWidth, height: toHeight, x: width / 2 - toWidth / 2 - cX, y: toY - cY}).then(v => {
        this.changed = true;
      })

    },
    close(e) {
      e.stopPropagation();
      if (this.changed) {
        let val = this.getContainerValue();
        this.showBody = false;
        this.cover(false)
        this.animate(val, this.initialValue.get()).then(v => {
          this.changed = false;
        });
      }
    },
    cover(show) {
      if (show) {
        let cover = document.createElement('div')
        cover.id = this.coverId
        cover.addEventListener('click', this.close)
        document.body.insertBefore(cover, document.body.firstChild)
      } else  {
        let cover = document.getElementById(this.coverId)
        cover && document.body.removeChild(cover)
      }

    }
  }

};
