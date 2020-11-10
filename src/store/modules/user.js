import {getInfo, login, logout} from '@/api/user';
import {getToken, removeToken, setToken} from '@/utils/auth';
import {resetRouter} from '@/router';

const state = {
  token  : getToken(),
  profile: {}
};
const getters = {
  profile: state => state.profile
}
const mutations = {
  SET_TOKEN  : (state, token) => {
    state.token = token;
  },
  SET_PROFILE: (state, profile) => {
    state.profile = profile;
  }
};

const actions = {
  // user login
  login({commit}, credentials) {
    const {username, password} = credentials;
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password}).then(response => {
        const {data} = response;
        commit('SET_TOKEN', data.access_token);

        setToken(data.access_token);

        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {data} = response;

        commit('SET_PROFILE', data);

        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '');
        commit('SET_PROFILE', {});
        removeToken();
        resetRouter();

        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      removeToken();
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
