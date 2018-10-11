<template>
  <div id="app">
    <btnRoute></btnRoute>
    <router-view/>
  </div>
</template>

<script>
  import btnRoute from './components/btnRoute'
export default {
  name: 'App',
  components: {
    btnRoute
  }
}
</script>

<style>
@import "./styles/index.scss";
</style>
