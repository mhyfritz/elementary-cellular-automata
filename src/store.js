import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    runCount: 0,
    code: 184,
    isRandom: true,
    density: 0.5,
    statePatterns: ["111", "110", "101", "100", "011", "010", "001", "000"]
  },
  mutations: {
    changeCode(state, payload) {
      state.code = payload;
    },
    incrementRunCount(state) {
      state.runCount += 1;
    },
    setRandom(state, payload) {
      state.isRandom = payload;
    },
    setDensity(state, payload) {
      state.density = payload;
    }
  }
});
