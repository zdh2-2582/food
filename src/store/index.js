import { createStore } from 'vuex'
import users from './modules/users';
import shops from './modules/shops';
import createPersistedState from "vuex-persistedstate";

const store = createStore({
  modules: {
    users,
    shops
  },
  plugins:[createPersistedState({
    paths:['users.token']
  })]
})

export default store;