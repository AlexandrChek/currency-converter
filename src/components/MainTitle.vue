<template>
  <h2>Light Currency Converter</h2>
</template>

<script>
export default {
  name: 'MainTitle'
}
</script>

<style scoped lang="scss">
h2 {
  margin: 0;
  padding: 11px 0 20px 0;
  color: rgb(248, 210, 138);
  font-size: 7vw;
  @media(min-width: 576px) {
    font-size: 6.3vw; 
  }
  @media(min-width: 768px) {
    font-size: 6vw;
    padding: 12px 0 25px 0;
  }
  @media(min-width: 1200px) {
    font-size: 3.9vw; 
  }
}
</style>