const state = {
  isExtracting: false
}

const mutations = {
  SET_IS_EXTRACTING(state, isExtracting) {
    state.isExtracting = isExtracting
  }
}

const actions = {
  setIsExtracting({ commit }, isExtracting) {
    commit('SET_IS_EXTRACTING', isExtracting)
  }
}

export default {
  state,
  mutations,
  actions,
  namespaced: true
}
