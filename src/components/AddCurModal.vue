<template>
    <div class="background-mod" @click="close">
        <div class="modal-window" @click.stop>
            <CurrencySelector class="selector-mod" @selectCurrency="saveCurrancy">Choose currency</CurrencySelector>
            <div>
                <MyButton class="btn-mod" @click="close">Cancel</MyButton>
            </div>
        </div>
    </div>
</template>

<script>
import CurrencySelector from './CurrencySelector.vue'
import MyButton from './MyButton.vue'

export default {
    name: 'AddCurModal',
    components: {
        CurrencySelector,
        MyButton
    },
    methods: {
        saveCurrancy(cur) {
            this.$emit('currencySelected', cur)
            if (localStorage.getItem('addedCurrencies')) {
                let added = JSON.parse(localStorage.getItem('addedCurrencies'))
                let addedSet = new Set(added)
                addedSet.add(cur)
                added = [...addedSet]
                localStorage.setItem('addedCurrencies', JSON.stringify(added))
            } else {
                let added = [cur]
                localStorage.setItem('addedCurrencies', JSON.stringify(added))
            }
            this.$emit('pressClose')
        },
        close() {
            this.$emit('pressClose')
        }
    }
}
</script>

<style scoped lang="scss">
@import '../extends';
.background-mod {
    @extend %background-modal;
}
.modal-window {
    @extend %modal-window
}
.selector-mod {
    width: 97%;
    margin-bottom: 10vw;
    @media(min-width: 576px) {
        width: 93%; 
    }
    @media(min-width: 768px) {
        width: 98.5%;
        margin-bottom: 7.8vw;
    }
    @media(min-width: 1200px) {
        margin: 10px 0 6.3vw 0;
        width: 91%;
    }
    @media(min-width: 1400px) {
        width: 94%;
        margin: 10px 0 5.2vw 0; 
    }
}
.btn-mod {
    @extend %modal-btn
}
</style>