import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

var countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/uk.json"));

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {},
    branches: [],
    branchContracts: [],
    verified_contracts: [],
    unverified_contracts: [],
    confirmed_utilizations: [],
    unconfirmed_utilizations: [],
    bIndex: null
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token) {
      state.status = 'success'
      state.token = token
    },
    auth_error(state) {
      state.status = 'error'
    },
    set_user(state, user) {
      state.user = user
    },
    logout(state) {
      state.status = ''
      state.token = ''
      state.user = {}
      state.branches = []
      state.branchContracts = []
      state.bIndex = null
    },
    user_restored(state, user) {
      state.status = 'success'
      state.user = user
    },
    branch_stored(state, branches) {
      state.status = 'success'
      state.branches = branches
    },
    verified_contracts_stored(state, contracts) {
      state.status = 'success'
      state.verified_contracts = contracts
    },
    unverified_contracts_stored(state, contracts) {
      state.status = 'success'
      state.unverified_contracts = contracts
    },
    confirmed_utilizations_stored(state, utilizations) {
      state.status = 'success'
      state.confirmed_utilizations = utilizations
    },
    unconfirmed_utilizations_stored(state, utilizations) {
      state.status = 'success'
      state.unconfirmed_utilizations = utilizations
    },
    branch_contracts_stored(state, contracts) {
      state.status = 'success'
      state.branchContracts = contracts
    },
    branch_contract_second(state, type, branch, index) {
      state.status = 'success'
      if (type == 2) {
        state.branchContracts[index].empl_branch = branch;
      }
      else {
        state.branchContracts[index].util_branch = branch;
      }
    },
    set_index(state, index) {
      state.bIndex = index;
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({ url: 'http://localhost:5000/api/auth/login', data: user, method: 'POST' })
          .then(resp => {
            axios
            .get('http://localhost:5000/api/user/', { headers: { Authorization: resp.data.Authorization } })
            .then(response => {
              const user_info = response.data
              commit('set_user', user_info)
            })
            .catch(err => {
              console.log(err.response.data.message);
            })

            const token = resp.data.Authorization
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = token

            commit('auth_success', token)
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    getUser({ commit }) {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:5000/api/user/', method: 'GET' })
          .then(resp => {
            commit('user_restored', resp.data)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getBranchContract({ commit }, index) {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:5000/api/user/branch/' + index + '/contract', method: 'GET' })
          .then(resp => {
            commit('branch_contracts_stored', resp.data)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getBranches({ commit }) {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:5000/api/user/branch/', method: 'GET' })
          .then(resp => {
            commit('branch_stored', resp.data)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    getVerifiedContracts({ commit }) {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:5000/api/contract/', method: 'GET' })
          .then(resp => {
            commit('verified_contracts_stored', resp.data);
            resolve(resp);
          })
          .catch(err => {
            reject(err);
          })
      })
    },
    getUnverifiedContracts({ commit }) {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:5000/api/contract/unverified', method: 'GET' })
          .then(resp => {
            commit('unverified_contracts_stored', resp.data);
            resolve(resp);
          })
          .catch(err => {
            reject(err);
          })
      })
    },
    getUnverifiedUtilizations({ commit }) {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:5000/api/transaction/unconfirmed', method: 'GET' })
          .then(resp => {
            commit('unconfirmed_utilizations_stored', resp.data.utilizations);
            resolve(resp);
          })
          .catch(err => {
            reject(err);
          })
      })
    },
    getVerifiedUtilizations({ commit }) {
      return new Promise((resolve, reject) => {
        axios({ url: 'http://localhost:5000/api/transaction/confirmed', method: 'GET' })
          .then(resp => {
            commit('confirmed_utilizations_stored', resp.data.utilizations);
            resolve(resp);
          })
          .catch(err => {
            reject(err);
          })
      })
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({ url: 'http://localhost:5000/api/user/', data: user, method: 'POST' })
          .then(resp => {
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    isUtilizer: state => state.user.type === 2,
    userInfo: state => state.user,
    userName: state => {
      if (state.user.type == 0) {
        return state.user.name + ' ' + state.user.surname;
      }
      else {
          return state.user.company_name;
      }
    },
    branches: state => {
      var branches = state.branches;
      for (let i = 0; i < branches.length; ++i) {
          branches[i].code = countries.getName(branches[i].code, "en")
      }
      return branches;
    }
  },
  modules: {
  }
})
