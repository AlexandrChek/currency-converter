<template>
    <div><slot></slot></div>
</template>

<script>
export default {
    name: 'InfoOutput'
}
</script>

<style scoped lang="scss">
@import '../extends';

div {
    @extend %inputs;
    @extend %inputs-padding;
}
</style>