<template>
  <div id="app">
    <OffCanvas />
    <TopNav />
    <UserModal v-if="isLoggedIn" />
    <CreateBranch v-if="isLoggedIn" />
    <router-view id="application" />
  </div>
</template>

<script>
import OffCanvas from './components/OffCanvas';
import TopNav from './components/TopNav';
import UserModal from './components/UserModal'
import CreateBranch from './components/CreateBranchModal'

  export default {
    components: {
      OffCanvas, TopNav, UserModal, CreateBranch
    },
    computed: {
      isLoggedIn: function() {
          return this.$store.getters.isLoggedIn;
      }
    }
  }
</script>

<style>
#application {
  min-height: 80vh;
}

body {
  min-height: 100vh;
  max-width: 100vw;
  overflow-x: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
