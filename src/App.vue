<template>
  <header>
    <MainTitle/>
  </header>
  <main>
    <section class="converter">
      <CurConverter/>
    </section>
    <section class="current-prices">
      <CurrentPrices/>
    </section>
  </main>
  <footer>
    <MainTitle/>
  </footer>
</template>

<script>
import MainTitle from './components/MainTitle.vue'
import CurConverter from './components/CurConverter.vue'
import CurrentPrices from './components/CurrentPrices.vue'

export default {
  name: 'App',
  components: {
    MainTitle,
    CurConverter,
    CurrentPrices
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font-weight: bold;
  background: linear-gradient(rgb(65, 15, 107) 5%, rgb(230, 70, 190), rgb(65, 15, 107));
}
body {
  margin: 0;
}
.converter, .current-prices {
  background-color: wheat;
  border-radius: 5px;
  margin: 0 3.8vw 3vw 3.8vw;
  padding-bottom: 10px;
  box-shadow: 0 0 8px .85vw rgb(88, 26, 73);
  color: rgb(65, 57, 57);
  @media(min-width: 768px) {
    margin: 0 4.8vw 3vw 4.8vw;
    padding-bottom: 17px;
  }
  @media(min-width: 1200px) {
    margin: 0 5.5vw 3vw 5.5vw;
    border-radius: 7px; 
  }
  @media(min-width: 1400px) {
    margin: 0 12vw 3vw 12vw; 
  }
}
</style>
