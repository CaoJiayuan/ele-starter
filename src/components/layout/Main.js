import Header from './Header';

export default {
  name: "Main",
  render(h) {
    let header = h(Header, {});
    let main = h('el-main', {}, [h('router-view')]);

    let writeSpace = h('div', {
      style: {
        height: '46px'
      }
    })

    return h('el-container', {
        props: {
          direction: 'vertical',
        }
      },
      [
        header,
        h('div', {
          class: 'app-main',
        }, [main, writeSpace]),
      ]);
  }
};
