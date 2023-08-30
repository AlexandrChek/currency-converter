<template>
    <h4>Current prices</h4>
    <article class="base-currency">
        <label for="currency">Base currency</label>
        <select id="currency" v-model="baseCurrency" @change="getCurPrices">
            <option v-for="currency in baseCurrencies" :key="currency">{{ currency }}</option>
        </select>
    </article>
    <article>
        <h5>Target Currencies</h5>
        <div v-for="item in prices" :key="item" class="target">
            <p class="target-item" :class="{'added': added.includes(item.currency)}" @click="showDelModal(item.currency)">
                {{ item.currency }} in {{ baseCurrency }}
            </p>
            <InfoOutput>{{ item.price }}</InfoOutput>
        </div>
        <div class="btn-wrapper">
            <MyButton @click="addCurMod = true">Add Currency</MyButton>
            <myButton id="update-btn" :class="{'disabled-button': disabledUpdate}" @click="update">
                Update <span v-if="disabledUpdate">{{ timer }}</span>
            </myButton>
        </div>
        <AddCurModal v-if="addCurMod" @currencySelected="addCurrency" @pressClose="addCurMod = false"/>
        <DelModal v-if="delCurMod" :toDel="toDel" @removePressed="delCurrency" @pressClose="delCurMod = false"/>
    </article>
</template>

<script>
import MyButton from './MyButton.vue'
import InfoOutput from './InfoOutput.vue'
import AddCurModal from './AddCurModal.vue'
import DelModal from './DelModal.vue'

export default {
    name: 'CurrentPrices',
    components: {
        MyButton,
        InfoOutput,
        AddCurModal,
        DelModal
    },
    data() {
        return {
            baseCurrencies: ['USD', 'EUR', 'UAH'],
            baseCurrency: 'USD',
            baseCurrencyInUsd: 1,
            targetCurrencies: ['USD', 'EUR', 'UAH'],
            targetCrypto: [['BTC', 90], ['ETH', 80]],
            prices: [],
            added: [],
            curError: false,
            addCurMod: false,
            disabledUpdate: false,
            timer: 5,
            toDel: '',
            delCurMod: false
        }
    },
    mounted() {
        this.checkAddedCur()
        this.getCurPrices()
    },
    methods: {
        checkAddedCur() {
            if (localStorage.getItem('addedCurrencies')) {
                this.added = JSON.parse(localStorage.getItem('addedCurrencies'))
                const cryptoMap = new Map(this.$store.state.crypto)
                if (this.added.length === 1) {
                    let item = this.added[0]
                    if (cryptoMap.has(item)) {
                        this.addSavedCrypto(cryptoMap, item)
                    } else {
                        this.targetCurrencies.push(item)
                    }
                } else {
                    this.added.forEach(e => {
                        if (cryptoMap.has(e)) {
                            this.addSavedCrypto(cryptoMap, e)
                        } else {
                            this.targetCurrencies.push(e)
                        }
                    })
                }
            }
        },
        getCurPrices() {
            this.prices = []
            let i = 1
            this.targetCurrencies.forEach(e => {
                let url = "https://v6.exchangerate-api.com/v6/1a0696dec132d55ac8c41644/pair/" + e + "/" + this.baseCurrency + "/"
                fetch(url)
                .then(response => response.json())
                .then(result => {
                    let curInBase = result.conversion_rate.toFixed(7)
                    let curObj = {}
                    if (e !== this.baseCurrency) {
                        curObj.id = this.$store.state.currencies.indexOf(e)
                        curObj.currency = e
                        curObj.price = curInBase
                        this.prices.push(curObj)
                    }
                    if (e === 'USD') {
                        this.baseCurrencyInUsd = 1 / result.conversion_rate
                    }
                    if (i === this.targetCurrencies.length - 1) {
                        this.curError = false
                        this.getCryptoPrices()
                    }
                    i++
                })
                .catch(error => {
                    if (error) {
                        if (this.curError) {
                            return
                        } else {
                            this.curError = true
                            this.getCryptoPrices()
                        }
                    }
                })
            })
        },
        getCryptoPrices() {
            let cryptoMap = new Map(this.targetCrypto)
            let i = 1
            cryptoMap.forEach((value, key) => {
                let url = "https://api.coinlore.net/api/ticker/?id=" + value
                fetch(url)
                .then(response => response.json())
                .then(result => {
                    let cryptoInBase = (result[0].price_usd / this.baseCurrencyInUsd).toFixed(7)
                    let cryptoObj = {}
                    cryptoObj.id = this.$store.state.currencies.indexOf(key)
                    cryptoObj.currency = key
                    cryptoObj.price = cryptoInBase
                    this.prices.push(cryptoObj)
                    if (i === cryptoMap.size) {
                        this.prices = this.prices.sort((a, b) => a.id - b.id)
                    }
                    i++
                })
            })
        },
        addCurrency(cur) {
            const cryptoMap = new Map(this.$store.state.crypto)
            const initialCryptoMap = new Map(this.targetCrypto)
            if (!initialCryptoMap.has(cur) && !this.targetCurrencies.includes(cur)) {
                this.added.push(cur)
                if (cryptoMap.has(cur)) {
                    let code = cryptoMap.get(cur)
                    let url = "https://api.coinlore.net/api/ticker/?id=" + code
                    fetch(url)
                    .then(response => response.json())
                    .then(result => {
                        let cryptoInBase = (result[0].price_usd / this.baseCurrencyInUsd).toFixed(7)
                        let cryptoObj = {}
                        cryptoObj.id = this.$store.state.currencies.indexOf(cur)
                        cryptoObj.currency = cur
                        cryptoObj.price = cryptoInBase
                        this.prices.push(cryptoObj)
                    })
                } else {
                    let url = "https://v6.exchangerate-api.com/v6/1a0696dec132d55ac8c41644/pair/" + cur + "/" + this.baseCurrency + "/"
                    fetch(url)
                    .then(response => response.json())
                    .then(result => {
                        let curInBase = result.conversion_rate.toFixed(7)
                        let curObj = {}
                        curObj.id = this.$store.state.currencies.indexOf(cur)
                        curObj.currency = cur 
                        curObj.price = curInBase
                        this.prices.push(curObj)
                    })
                }
            }
        },
        addSavedCrypto(cryptoMap, crypto) {
            let code = cryptoMap.get(crypto)
            let addCrypto = [crypto, code]
            this.targetCrypto.push(addCrypto)
        },
        update() {
            this.checkAddedCur()
            this.getCurPrices()
            const btn = document.querySelector('#update-btn')
            btn.disabled = true
            this.disabledUpdate = true
            let timerId = setInterval(() => {
                this.timer--
                if (this.timer <= 0) {clearInterval(timerId)}
            }, 1000)
            setTimeout(this.anableBtn, 5000, btn)
            this.timer = 5
        },
        anableBtn(btn) {
            btn.disabled = false
            this.disabledUpdate = false
        },
        showDelModal(cur) {
            if (this.added.includes(cur)) {
                this.toDel = cur
                this.delCurMod = true
            }
        },
        delCurrency(cur) {
            let ind
            this.prices.forEach((e, i) => {
                if (e.currency === cur) {
                    ind = i
                }
            })
            this.prices.splice(ind, 1)
        }
    }
}
</script>

<style scoped lang="scss">
@import '../extends';

h4 {
    @extend %section-head;
}
.base-currency, .target {
    @extend %flex-wrapper;
    @media(min-width: 1200px) {
        width: 100%;
        margin: 14px 0;
        display: flex;
        justify-content: center;
    }
}
h5 {
    @extend %labels;
    margin: 2.5vw 0;
}
label, .target-item {
    @extend %labels;
    @media(min-width: 1200px) {
        margin-right: 4vw;
    }
}
.added {
    text-decoration: underline;
    cursor: pointer;
    &:hover {
        opacity: .8;
    }
}
select {
    @extend %inputs;
    padding-left: 2px;
}
.btn-wrapper {
    margin: 2.5vw;
}
.disabled-button {
    opacity: .5;
}
</style>