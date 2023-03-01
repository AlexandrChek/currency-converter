<template>
    <div>
        <label for="currency"><slot></slot></label>
        <select id="currency" v-model="currency">
            <option v-for="currency in currencies" :key="currency">{{ currency }}</option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'CurrencySelector',
    props: ['defaultCurrency'],
    data() {
        return {
            currencies: this.$store.state.currencies,
            currency: this.defaultCurrency
        }
    },
    watch: {
        currency(val) {
            this.$emit('selectCurrency', val)
        }
    }
}
</script>

<style scoped lang="scss">
@import '../extends';

div {
    @extend %flex-wrapper;
}
label {
    @extend %labels; 
}
select {
    @extend %inputs;
    padding-left: 2px;
}
</style>