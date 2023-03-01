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
.background-mod {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .7);
    z-index: 10;
}
.modal-window {
    width: 78vw;
    padding: 20px;
    border-radius: 8px;
    background-color: rgb(205, 205, 205);
    box-shadow: inset 0px -3px 4px 4px rgb(75, 35, 35);
    @media(min-width: 576px) {
        width: 70vw;
        padding: 20px 20px 25px 20px;
    }
    @media(min-width: 768px) {
        width: 59vw; 
    }
    @media(min-width: 1200px) {
        width: 40vw; 
    }
    @media(min-width: 1400px) {
        width: 35vw; 
    }
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
    width: 34%;
    @media(min-width: 576px) {
        width: 27%; 
    }
}
</style>