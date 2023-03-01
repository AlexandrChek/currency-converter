import { createStore } from 'vuex'

export default createStore({
  state: {
    currencies: ['USD', 'EUR', 'UAH', 'GBP', 'BTC', 'ETH', 'BNB', 'XRP'],
    crypto: [['BTC', 90], ['ETH', 80], ['BNB', 2710], ['XRP', 58]]
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})