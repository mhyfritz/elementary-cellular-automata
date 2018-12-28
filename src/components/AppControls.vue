<template>
  <div>
    <table>
      <tr>
        <th scope="row">States</th>
        <td v-for="(pattern, i) in $store.state.statePatterns" :key="i">{{pattern}}</td>
        <th scope="col">Wolfram code</th>
      </tr>
      <tr>
        <th scope="row">Next (center) state</th>
        <td v-for="(bit, i) in bits" :key="i">
          <input :value="bit" @input="event => { updateBits(event, i) }">
        </td>
        <td key="code">
          <input :value="code" @input="updateCode">
        </td>
      </tr>
    </table>
    <div class="controls-container">
      <div>
        <input type="checkbox" id="inputRandom" v-model="isRandom">
        <label for="inputRandom">Random start configuration</label>
      </div>
      <div>
        <input
          type="text"
          id="inputDensity"
          placeholder="Fraction"
          v-model.number="density"
          :disabled="!isRandom"
        >
        <label for="inputDensity">Starting density</label>
      </div>
      <button type="submit" class="btn btn-outline-white" @click="run" :disabled="hasErrors">Run</button>
    </div>
  </div>
</template>

<script>
function toBits(x) {
  return x
    .toString(2)
    .padStart(8, "0")
    .split("");
}

function fromBits(bits) {
  return Number.parseInt(bits.join(""), 2);
}

export default {
  name: "AppControls",
  data() {
    return {
      code: this.$store.state.code,
      bits: toBits(this.$store.state.code),
      errors: {}
    };
  },
  computed: {
    isRandom: {
      get() {
        return this.$store.state.isRandom;
      },
      set(value) {
        this.$store.commit("setRandom", value);
      }
    },
    density: {
      get() {
        return this.$store.state.density;
      },
      set(value) {
        this.$store.commit("setDensity", value);
        if (typeof value !== "number" || value <= 0 || value > 1) {
          this.$set(this.errors, "density", true);
        } else {
          this.$delete(this.errors, "density");
        }
      }
    },
    hasErrors() {
      if (
        !this.isRandom &&
        "density" in this.errors &&
        Object.keys(this.errors).length === 1
      ) {
        return false;
      }
      return Object.keys(this.errors).length > 0;
    }
  },
  methods: {
    run() {
      if (this.hasErrors) {
        return;
      }
      if (this.code !== this.$store.state.code) {
        this.$store.commit("changeCode", this.code);
      }
      this.$store.commit("incrementRunCount");
    },
    updateCode(event) {
      const newCode = Number.parseInt(event.target.value, 10);
      this.code = Number.isNaN(newCode) ? event.target.value : newCode;
      if (Number.isNaN(newCode) || newCode < 0 || newCode > 255) {
        this.$set(this.errors, "code", true);
        return;
      }
      this.$delete(this.errors, "code");
      this.bits = toBits(newCode);
    },
    updateBits(event, index) {
      const newBit = Number.parseInt(event.target.value, 10);
      this.$set(
        this.bits,
        index,
        Number.isNaN(newBit) ? event.target.value : newBit
      );
      if (Number.isNaN(newBit) || newBit < 0 || newBit > 1) {
        this.$set(this.errors, "bits", true);
        return;
      }
      this.$delete(this.errors, "bits");
      this.code = fromBits(this.bits);
    }
  }
};
</script>

<style scoped>
th[scope="row"] {
  text-align: right;
  padding-right: 1rem;
}

th[scope="col"] {
  padding-left: 1rem;
}

td {
  text-align: center;
}

td > input {
  width: 50px;
  text-align: center;
}

input,
button {
  font-family: inherit;
}

.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.controls-container label {
  margin-left: 0.5rem;
}

/* adapted from Bootstrap 4 */
.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn:not(:disabled) {
  cursor: pointer;
}

.btn-outline-white {
  color: white;
  border-color: white;
  background-color: transparent;
}

.btn-outline-white:hover {
  color: black;
  background-color: white;
}

.btn-outline-white:disabled,
.btn-outline-white:disabled:hover {
  background-color: #ddd;
  border-color: #ddd;
  color: white;
}
</style>
