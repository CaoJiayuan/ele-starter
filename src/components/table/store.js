import {BrowserStorage} from "nerio-js-utils";
import Vuex from "vuex";
const storage = new BrowserStorage()

let key = '__table_data__';
if (!storage.get(key)) {
  storage.put(key, {})
}

const state = {
  tableData: storage.get(key, {}),
  currentTable: null
};

const getters = {
  tableData: state => state.tableData,
  currentTable: state => state.currentTable,
  currentFilters: state => state.tableData[state.currentTable]?.filters
}
const mutations = {
  SET_DATA: (state, data) => {
    state.tableData = data
    storage.put(key, data)
  },
  SET_CURRENT: (state, current) => {
    state.currentTable = current
  },
};

const actions = {
  setFilters({commit, state}, filters) {
    let current = state.currentTable

    let data = state.tableData;
    let currentData = data[current] || {};
    currentData['filters'] = filters
    data[current] = currentData
    commit('SET_DATA', data)
  },
  setCurrent({commit}, current) {
    commit('SET_CURRENT', current)
  },
  loadFilters({state}) {
    let current = state.currentTable

    return state.tableData[current]?.filters || {}
  }
};

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});

export default store;
