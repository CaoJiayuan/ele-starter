import Aside from './Aside';
import Main from './Main.js';

export default {
  name: 'Layout',
  render(h) {
    return h('el-container', {
      class: 'app-container'
    }, [
      h(Aside),
      h(Main),
    ]);
  }
};
