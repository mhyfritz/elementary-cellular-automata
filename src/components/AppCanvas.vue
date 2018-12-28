<template>
  <canvas ref="canvas" :width="width" :height="height"></canvas>
</template>

<script>
export default {
  name: "AppCanvas",
  data() {
    return {
      width: 699,
      height: 699
    };
  },
  methods: {
    run() {
      if (this.$_raf !== null) {
        window.cancelAnimationFrame(this.$_raf);
      }

      const context = this.$refs.canvas.getContext("2d");
      context.fillStyle = "black";
      context.fillRect(0, 0, this.width, this.height);
      let round = 0;

      let cells = Array.from({ length: this.width }).fill(0);
      if (this.$store.state.isRandom) {
        for (let i = 0; i < cells.length; i += 1) {
          if (Math.random() < this.$store.state.density) {
            cells[i] = 1;
          }
        }
      } else {
        cells[Math.floor(cells.length / 2)] = 1;
      }

      const step = () => {
        const imageData = context.createImageData(cells.length, 1);
        imageData.data.fill(255);
        for (let i = 0; i < cells.length; i += 1) {
          if (cells[i] === 0) {
            imageData.data[i * 4 + 3] = 0;
          }
        }
        context.putImageData(imageData, 0, round);
        round += 1;

        if (round < this.height) {
          const cellsNext = Array.from({ length: cells.length }).fill(0);
          for (let i = 0; i < cells.length; i += 1) {
            cellsNext[i] = this.getNewState(
              `${cells[(i - 1 + cells.length) % cells.length]}${cells[i]}${
                cells[(i + 1) % cells.length]
              }`
            );
          }
          cells = cellsNext;
          this.$_raf = window.requestAnimationFrame(step);
        } else {
          this.$_raf = null;
        }
      };

      this.$_raf = window.requestAnimationFrame(step);
    },
    getNewState(curr) {
      const ret = {};
      for (let i = 0; i < this.$store.state.statePatterns.length; i += 1) {
        ret[this.$store.state.statePatterns[i]] = this.newStates[i];
      }
      return ret[curr];
    }
  },
  computed: {
    newStates() {
      return this.$store.state.code
        .toString(2)
        .padStart(8, "0")
        .split("")
        .map(c => Number.parseInt(c, 10));
    }
  },
  watch: {
    "$store.state.runCount": function() {
      this.run();
    }
  },
  created() {
    this.$_raf = null;
  }
};
</script>

<style scoped>
canvas {
  display: block;
  border: 1px solid white;
}
</style>
