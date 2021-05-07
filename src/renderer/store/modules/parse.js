const state = {
  isParsing: false
}

const mutations = {
  SET_IS_PARSING(state, isParsing) {
    state.isParsing = isParsing
  }
}

const actions = {
  setIsParsing({ commit }, isParsing) {
    commit('SET_IS_PARSING', isParsing)
  }
}

export default {
  state,
  mutations,
  actions,
  namespaced: true
}
