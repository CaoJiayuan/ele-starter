import {BrowserStorage} from "nerio-js-utils";
const storge = new BrowserStorage()


const state = {
  collapse : storge.get('nav:collapse', false)
}

const getters = {
  collapse: state => state.collapse
}

const mutations = {
  SET_COLLAPSE  : (state, collapse) => {
    state.collapse = collapse;
  }
};

const actions = {
  collapseNav({commit}, collapse) {
    commit('SET_COLLAPSE', collapse);
    storge.put('nav:collapse', collapse)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
