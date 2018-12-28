<template>
  <div id="app">
    <AppControls/>
    <AppCanvas style="margin: 1rem auto 0;"/>
  </div>
</template>

<script>
import AppControls from "./components/AppControls.vue";
import AppCanvas from "./components/AppCanvas.vue";

export default {
  name: "app",
  components: {
    AppControls,
    AppCanvas
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Share+Tech+Mono");

#app {
  font-family: "Share Tech Mono", monospace;
  margin-top: 1rem;
}
</style>
