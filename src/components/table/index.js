import pagination from "./pagination";
import _ from 'lodash';

export default {
  name    : 'Table',
  props   : {
    fields   : {
      type    : Array,
      required: true
    },
    actions  : {
      type   : Array,
      default: () => []
    },
    pageSizes: {
      type   : Array,
      default: () => [10, 15, 20, 30, 50]
    }
  },
  data() {
    return {
      cacheFields  : [],
      cacheActions : [],
      defaultField : {
        prop       : 'id',
        sortable   : false,
        label      : 'ID',
        align      : 'center',
        headerAlign: 'center'
      },
      defaultAction: {
        type  : 'text',
        action: 'action',
        label : 'action',
        click : (action, row) => this.$emit(action.action, row),
        size  : 'small',
        granted: () => true
      },
      pageMeta     : {
        currentPage: 1,
        total      : 0,
        size       : 10
      },
      showActions: true
    };
  },
  mixins  : [pagination],
  computed: {
    fixedFields() {
      if (this.cacheFields.length > 0) {
        return this.cacheFields;
      }

      return this.cacheFields = this.fields.map(field => {
        if (typeof field == 'object') {
          if (field.sortable) {
            field.sortable = 'custom'
          }

          return Object.assign(_.clone(this.defaultField), field);
        }

        return field;
      });
    },
    fixedActions() {
      if (this.cacheActions.length > 0) {
        return this.cacheActions;
      }

      return this.cacheActions = this.actions.map(action => {
        if (typeof action == 'object') {
          return Object.assign(_.clone(this.defaultAction), action);
        }

        return action;
      });
    },
  },
  render(h) {
    let columns = this.fixedFields.map(field => {
      return this.renderColumn(h, field);
    });
    let actions = this.fixedActions;
    if (actions.length > 0 && this.showActions) {
      columns.push(this.renderActions(h, actions));
    }

    let table = h('el-table', {
      props: {
        data: this.paginator.data
      },
      on: {
        'sort-change': ({prop, order}) => {
          let o = order === 'ascending'? 'asc' : 'desc'
          let sort = `${prop}|${o}`

          this.load({sort})
        }
      },
      directives: [
        {
          name: 'loading',
          value: this.loading
        }
      ]
    }, columns);

    let page = this.renderPage(h);

    return h('div', {
      class: 'table-container'
    }, [table, page]);
  },
  methods : {
    renderColumn(h, props) {
      let rf = value => {
        return value;
      };

      // 有render函数
      if (props.render && typeof props.render === 'function') {
        rf = props.render;
      }

      return h('el-table-column', {
        props,
        scopedSlots: {
          default: ({row, $index}) => {
            let key = props.prop;
            let value;
            if (key === '$index') {
              value = $index;
            } else {
              value = row[key];
            }

            return rf.call(this.$parent, value, row, h);
          }
        }
      });
    },
    renderActions(h, actions) {
      let rf = (action, row) => {
        return h('el-button', {
          on   : {
            click: e => action.click(action, row)
          },
          props: {
            type: action.type,
            size: action.size
          }
        }, [action.label]);
      };

      return h('el-table-column', {
        props      : {
          label      : '操作',
          align      : 'center',
          headerAlign: 'center'
        },
        scopedSlots: {
          default: ({row}) => {
            let acs = actions.filter(action => action.granted()).map(action => {
              // 有render函数
              if (action.render && typeof action.render === 'function') {
                rf = action.render;
              }
              return rf.call(this.$parent, action, row, h);
            });
            this.showActions = acs.length > 0
            return acs;
          }
        }
      });
    },
    renderPage(h) {
      let meta = this.pageMeta;
      return h('el-pagination', {
        props: {
          layout     : 'prev, pager, next, sizes',
          total      : meta.total,
          currentPage: meta.currentPage,
          pageSizes  : this.pageSizes
        },
        on   : {
          'current-change': page => this.page(page),
          'size-change': size => this.load({per_page: size})
        }
      });
    }
  },
  mounted() {
    this.load({}).then(res => {
      let {meta} = res;
      this.pageMeta.currentPage = meta.currentPage;
      this.pageMeta.total = meta.total;
      this.pageMeta.size = meta.per_page;
    });
  }
};
