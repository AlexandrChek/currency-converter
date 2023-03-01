<template>
    <button>
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'MyButton'
}
</script>

<style scoped lang="scss">
$dark-burgundy: rgb(82, 12, 12);

button {
    padding: 7px 11px;
    margin: 0 8px;
    background-color: rgb(145, 20, 20);
    color: white;
    font-weight: bold;
    font-size: calc(10px + 1.5vw);
    letter-spacing: .23vw;
    word-spacing: .35vw;
    line-height: 1.3;
    border-radius: 7px;
    border: 2px solid $dark-burgundy;
    box-shadow: inset 0px -1.5px 3px 3px $dark-burgundy;
    &:hover {
        color: rgb(255, 253, 230);
        background-color: rgb(175, 25, 25);
    }
    &:active {
        box-shadow: none;
        transition: all .1s;
    }
    @media (min-width: 576px) {
        font-size: 16.5px;
        margin: 0 10.5px;
    }
    @media (min-width: 768px) {
        font-size: 17.5px;
        letter-spacing: .17vw;
        line-height: 1.35;
    }
    @media (min-width: 992px) {
        font-size: 19px;
        word-spacing: .25vw;
        letter-spacing: .15vw;
        line-height: 1.4;
        margin: 0 12px;
    }
    @media (min-width: 1200px) {
        font-size: 19px;
        letter-spacing: .12vw;
    }
    @media (min-width: 1400px) {
        font-size: 19.5px;
        letter-spacing: .11vw;
        line-height: 1.42;
    }
}
</style>