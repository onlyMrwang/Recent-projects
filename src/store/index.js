import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import settings from './modules/settings'
import user from './modules/user'
import account from './modules/account';
import common from './modules/common';
import dict from './modules/dict';
import monitoring from './modules/monitoring'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer(val) {
        return {
          settings: val.settings,
          user: val.user,
          dict: val.dict
        }
    }
  })],
  modules: {
     settings,
     user,
     dict,
     account,
     common,
     monitoring
  },
  getters
})

export default store
