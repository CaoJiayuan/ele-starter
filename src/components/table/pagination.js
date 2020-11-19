import { functions, BrowserStorage } from 'nerio-js-utils'
import request from '@/request'
import _ from 'lodash'

const {setQuery, httpQueryString} = functions

export default {
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    cacheExpire : {
      type:Number,
      default:() => 0
    }
  },
  data () {
    return {
      paginator: {
        meta: {
          total: 0,
          per_page: 10,
          current_page: 1,
          last_page: 0,
          from: 0,
          to: 0,
        },
        data: []
      },
      pagination: {},
      filters: {},
      loading: false,
      refreshing: false,
      pageSize: 10,
      keyword: null
    }
  },
  methods: {
    load ({per_page = this.pageSize, page = 1, sort, filters, search}, append = false) {
      this.loading = true
      this.selected = []
      let params = {
        per_page,
        page,
      };
      let extras = {};
      let resolvedSort = sort !== undefined ? sort : this.resolveSort(this.pagination);
      if (resolvedSort) {
        extras.sort = resolvedSort;
      }
      if (search) {
        extras.filter = search;
      }
      params = Object.assign(params, extras);

      filters = filters ? this.buildFilters(filters) : this.filters
      return this.getData(this.apiUrl, Object.assign(params, filters), this.cacheExpire).then(response => {
        let paginator = response.data
        this.loading = false
        this.refreshing = false
        paginator.url = setQuery(response.config.url, response.config.params)
        let { data, meta  } = paginator
        this.paginator.meta = meta
        if (append) {
          this.paginator.data = this.paginator.data.concat(data)
        } else  {
          this.paginator.data = data
        }

        this.$emit('loaded', this.paginator)
        return this.paginator
      }).catch(error => {
        this.loading = false
        this.refreshing = false
      })
    },
    buildFilters (filters, name = 'filters') {
      let clone = _.clone(filters)
      let result = {}
      for (let k in clone) {
        if (clone.hasOwnProperty(k) && [null, '', undefined].indexOf(clone[k]) < 0) {
          let key = `${name}[${k}]`
          result[key] = clone[k]
        }
      }
      this.filters = result
      return result
    },
    resolveSort (pagination) {
      if (pagination.sortBy) {
        let key = pagination.sortBy
        key += pagination.descending ? '|desc' : '|asc'
        return key
      }
      return undefined
    },
    refresh () {
      this.refreshing = true
      this.keyword = null
      return this.load({
        per_page: this.pageSize,
        page: 1,
        sort: null
      })
    },
    page (page, append = false) {
      return this.load({
        page: page,
        search: this.keyword
      }, append)
    },
    nextPage(append = false) {
      return this.load({
        page: this.paginator.meta.current_page + 1
      }, append)
    },
    filter(filters){
      this.load({
        filters
      });
    },
    search(search){
      this.keyword = search
      this.load({
        search
      });
    },
    getData (url, params = {}, cacheExpire = 0, config = {}) {

      let storage = new BrowserStorage()
      let conf = Object.assign({
        params: params
      }, config);
      if (cacheExpire > 0) {
        let key = url + '?' + httpQueryString(params);
        let data = storage.get(key)
        if (data && data.expires_in > new Date().getTime()) {
          return Promise.resolve(data.data)
        } else  {
          let expires_in = new Date().getTime() + (60 * cacheExpire * 1000)
          return request({url, params}).then(response => {
            data = {
              expires_in,
              data : response
            }
            storage.put(key, data);

            return response;
          })
        }
      }

      return request({url, method: 'get', params})
    },
    reload(params = {}) {
      return this.load(params)
    }
  }
}
