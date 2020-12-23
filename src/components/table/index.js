import pagination from "./pagination";
import _ from 'lodash';
import './table.scss'
import store from './store'

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
    autoload  : {
      type   : Boolean,
      default: true
    },
    showActions  : {
      type   : Boolean,
      default: true
    },
    pageSizes: {
      type   : Array,
      default: () => [5, 10, 15, 20, 30, 50]
    },
    value: Object | Array | Number,
    valueResolver: {
      type: Function,
      default: row => row
    },
    selectable: Boolean,
    multiple: Boolean,
    size: {
      type: String,
      default: 'small'
    },
    keyName: {
      type: String,
      default: 'id'
    },
    actionAlign: {
      type: String,
      default: 'left'
    },
    actionWidth: {
      type: String
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
        headerAlign: 'center',
        show       : true
      },
      defaultAction: {
        type: 'primary',
        action: 'action',
        label : 'action',
        size  : 'mini',
        granted: () => true,
        disabled: false
      },
      pageMeta     : {
        currentPage: 1,
        total      : 0,
        size       : 10
      },
      parsedCurrentRow: null,
      currentRowParsed: false,
      parsedCurrentRows: [],
      currentRowsParsed: false,
      tableFilters: {}
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
    currentRow: {
      get() {
        if (!this.value) {
          return this.value
        }

        if (!this.currentRowParsed && this.loaded) {
          let rows = this.paginator.data.filter(item => item[this.keyName] === this.value[this.keyName])
          this.currentRowParsed = true
          if (rows.length) {
            this.parsedCurrentRow = rows[0]
          }
          this.waitLoad().then(res => {
            this.$refs.table.setCurrentRow(this.parsedCurrentRow)
          })
          return this.parsedCurrentRow
        }

        return this.parsedCurrentRow
      },
      set(v) {
        this.currentRowParsed = true
        this.parsedCurrentRow = v
        this.$emit('input', v)
      }
    },
    currentRows: {
      get() {
        if (!this.value || this.value.length < 1) {
          return []
        }

        if (!this.currentRowsParsed && this.loaded) {
          let keys = this.value.map(v => v[this.keyName])
          let rows = this.paginator.data.filter(item => keys.indexOf(item[this.keyName]) > -1)
          this.waitLoad().then(res => {
            rows.map(row => this.$refs.table.toggleRowSelection(row))
          })
          this.currentRowsParsed = true
          this.parsedCurrentRows = rows
          return this.parsedCurrentRows
        }

        return this.parsedCurrentRows
      },
      set(v) {
        this.currentRowsParsed = true
        this.parsedCurrentRows = v
        this.$emit('input', v)
      }
    },

  },
  render(h) {
    let columns = this.fixedFields.map(field => {
      return this.renderColumn(h, field);
    });
    let first
    if (this.selectable) {
      if (this.multiple) {
        first = h('el-table-column', {
          props: {
            type: 'selection'
          }
        })
      } else {
        first = h('el-table-column', {
          props: {
            prop: this.keyName,
            width: '32px'
          },
          scopedSlots: {
            default: ({row, $index}) => {
              if (this.currentRow) {
                if (row[this.keyName] === this.currentRow[this.keyName]) {
                  return h('i', {
                    class: 'el-icon-check',
                    style: {
                      color: '#34b4ea',
                      fontWeight: 'bolder'
                    }
                  },)
                }
              }
            }
          }
        })
      }
    }
    if (first) {
      columns = [first, ...columns]
    }

    let actions = this.fixedActions;
    if (this.showActions && actions.length > 0 && this.checkActions(actions).length > 0) {
      columns.push(this.renderActions(h, actions));
    }

    let table = h('el-table', {
      props: {
        data: this.paginator.data,
        highlightCurrentRow: this.selectable && !this.multiple,
        size: this.size
      },
      on: {
        'sort-change': ({prop, order, column}) => {
          let sortBy = column.sortBy || prop
          let o = order === 'ascending'? 'asc' : 'desc'
          let sort = `${sortBy}|${o}`

          this.load({sort})
        },
        'current-change': (row) => {
          if (this.multiple) {
            this.$refs.table.toggleRowSelection(row)
            this.$forceUpdate()
          } else {
            this.currentRow = row
          }
        },
        'selection-change': selection => {
          this.currentRows = selection.filter(s => s !== null)
        }
      },
      directives: [
        {
          name: 'loading',
          value: this.loading
        }
      ],
      ref: 'table'
    }, columns);

    let page = this.renderPage(h);
    let cancelSelection;
    if (this.selectable) {
      if (this.currentRow || this.currentRows.length > 0) {
        cancelSelection = h('el-button', {
          props: {
            type: 'text'
          },
          on: {
            click: e => {
              if (this.multiple) {
                this.currentRows = []
                this.$refs.table.clearSelection()
              } else  {
                this.currentRow = undefined
                this.$refs.table.setCurrentRow(undefined)
              }
            }
          }
        }, '取消选择')
      }
    }
    let filters = this.renderFilters(h)

    return h('div', {
      class: 'table-container'
    }, [filters, table, cancelSelection, page, h('div', {
      style: {
        clear: 'both'
      }
    })]);
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
            } else if (key === '#') {
              let {per_page, current_page} = this.paginator.meta
              value = $index + 1 + (per_page * (current_page - 1));
            } else {
              value = row[key];
            }

            return rf.call(this.$parent, value, row, h, this);
          }
        }
      });
    },
    renderActions(h, actions) {
      let reload = this.reload
      let rf = (action, row) => {
        return h('el-button', {
          on   : {
            click: e => {
              if (!action.click) {
                this.$emit(action.action, _.clone(row), reload)
              } else {
                action.click(action, _.clone(row), reload)
              }
            }
          },
          props: {
            type: action.type,
            size: action.size,
            disabled: action.disabled
          },
          style: action.style || {}
        }, [action.label]);
      };
      return h('el-table-column', {
        props      : {
          label      : '操作',
          align      : this.actionAlign,
          headerAlign: this.actionAlign,
          width      : this.actionWidth
        },
        scopedSlots: {
          default: ({row}) => {
            let acs = actions.filter(action => action.granted(_.clone(row))).map(action => {
              // 有render函数
              if (action.render && typeof action.render === 'function') {
                rf = action.render;
              }
              return rf.call(this.$parent, action, row, h);
            });

            return acs;
          }
        }
      });
    },
    renderPage(h) {
      if (!this.paginate) {
        return undefined
      }

      let meta = this.paginator.meta;
      return h('el-pagination', {
        props: {
          layout     : 'total,prev, pager, next, sizes',
          total      : meta.total,
          currentPage: meta.current_page,
          pageSizes  : this.pageSizes
        },
        on   : {
          'current-change': page => this.page(page),
          'size-change': size => {
            this.pageSize = size
            this.load({per_page: size})
          }
        }
      });
    },
    renderFilters(h) {
      if (this.$scopedSlots.filters) {

        let actions = h('div', {
          class: 'table-filter-actions'
        },[
          h('el-button', {
            props: {
              size: 'small',
              type: 'primary'
            },
            on: {
              click: e => {
                store.dispatch('setFilters', this.tableFilters)
                this.filter(this.tableFilters)
              }
            }
          }, '筛选'),
          h('el-button', {
            props: {
              size: 'small',
            },
            on: {
              click: e => {
                this.tableFilters = {}
                store.dispatch('setFilters', this.tableFilters)
                this.filter(this.tableFilters)
              }
            }
          }, '重置'),
        ])

        let d = h('el-divider')

        return h('div', {
          class: 'table-filters'
        }, [this.$scopedSlots.filters(this.tableFilters), actions, d])
      }

      return undefined
    },
    checkActions(actions) {
      return actions.filter(action => {
        return this.paginator.data.filter(i => action.granted(_.clone(i))).length > 0
      })
    },
    loadTable(){
      this.load({})
    }
  },
  mounted() {

    if (this.paginate) {
      store.dispatch('setCurrent', this.apiUrl).then(res => {

        store.dispatch('loadFilters').then(res => {
          this.tableFilters = res
          this.autoload && this.load({
            filters: this.tableFilters
          })
        })
      })
    } else  {
      this.loadTable()
    }
  },
  watch: {
    value(row) {

    }
  }
};
