<template>
    <h4>Currency converter</h4>
    <article>
        <CurrencySelector :defaultCurrency="initialCurrency" @selectCurrency="saveInitialCurrency">
            Initial currency
        </CurrencySelector>
        <CurrencySelector :defaultCurrency="finalCurrency" @selectCurrency="saveFinalCurrency">
            Final currency
        </CurrencySelector>
    </article>
    <article>
        <div class="scope">
            <label for="initial-scope">Initial scope</label>
            <input type="text" id="initial-scope" v-model="initialScope" @input="checking" @focus="inputFocus" @blur="inputBlur">
        </div>
        <div class="scope">
            <p class="scope-label">Final scope</p>
            <div class="final-scope">{{ finalScope }}</div>
        </div>
        <p class="restriction">
            The final scope should not exceed $10,000!
        </p>
    </article>
</template>

<script>
import CurrencySelector from './CurrencySelector.vue'

export default {
    name: 'CurConverter',
    components: {CurrencySelector},
    data() {
        return {
            initialCurrency: 'USD',
            finalCurrency: 'BTC',
            initialScope: 0,
            finalScope: 0,
            curInUsd: 0,
            cryptoInUsd: 0
        }
    },
    methods: {
        saveInitialCurrency(val) {
            this.initialCurrency = val
            if (this.initialScope > 0) {this.checking()}
        },
        saveFinalCurrency(val) {
            this.finalCurrency = val
            if (this.initialScope > 0) {this.checking()}
        },
        inputFocus() {
            if (this.initialScope === 0) {
                this.initialScope = '' 
            }
        },
        inputBlur() {
            if (this.initialScope === '') {
                this.initialScope = 0 
            }
        },
        checking() {
            const cryptoMap = new Map(this.$store.state.crypto)
            if (!cryptoMap.has(this.initialCurrency)) {
                if (this.initialCurrency === 'USD') {
                    if (this.initialScope > 10000) {
                        this.highlighting()
                    } else {this.convert(cryptoMap)}
                } else {
                   let curUrl = "https://v6.exchangerate-api.com/v6/1a0696dec132d55ac8c41644/pair/" + this.initialCurrency + "/USD/" + this.initialScope
                   fetch(curUrl)
                    .then(response => response.json())
                    .then(result => {
                        if (result.conversion_result > 10000) {
                            this.highlighting()
                        } else {
                            this.curInUsd = result.conversion_result
                            this.convert(cryptoMap)
                        }
                    })
                }
            } else {
                let cryptoUrl = "https://api.coinlore.net/api/ticker/?id=" + cryptoMap.get(this.initialCurrency)
                fetch(cryptoUrl)
                .then(response => response.json())
                .then(result => {
                    if (this.initialScope * result[0].price_usd > 10000) {
                        this.highlighting() 
                    } else {
                        this.cryptoInUsd = this.initialScope * result[0].price_usd
                        this.convert(cryptoMap)
                    }
                })
            }
        },
        convert(cryptoMap) {
            if (!cryptoMap.has(this.initialCurrency) && !cryptoMap.has(this.finalCurrency)) {
                let url = "https://v6.exchangerate-api.com/v6/1a0696dec132d55ac8c41644/pair/" + this.initialCurrency + "/" + this.finalCurrency + "/" + this.initialScope
                fetch(url)
                .then(response => response.json())
                .then(result => this.finalScope = result.conversion_result.toFixed(4))
            } else if (!cryptoMap.has(this.initialCurrency) && cryptoMap.has(this.finalCurrency)) {
                let cryptoUrl = "https://api.coinlore.net/api/ticker/?id=" + cryptoMap.get(this.finalCurrency)
                if (this.initialCurrency === 'USD') {
                    fetch(cryptoUrl)
                    .then(response => response.json())
                    .then(result => this.finalScope = (this.initialScope / result[0].price_usd).toFixed(7))
                } else {
                    fetch(cryptoUrl)
                    .then(response => response.json())
                    .then(result => this.finalScope = (this.curInUsd / result[0].price_usd).toFixed(7))
                }
            } else if (cryptoMap.has(this.initialCurrency) && !cryptoMap.has(this.finalCurrency)) {
                if (this.finalCurrency === 'USD') {
                    this.finalScope = this.cryptoInUsd.toFixed(4)
                } else {
                    let curUrl = "https://v6.exchangerate-api.com/v6/1a0696dec132d55ac8c41644/pair/" + this.finalCurrency + "/USD/"
                    fetch(curUrl)
                    .then(response => response.json())
                    .then(result => this.finalScope = (this.cryptoInUsd * result.conversion_rate).toFixed(4))
                }
            } else {
                let cryptoUrl = "https://api.coinlore.net/api/ticker/?id=" + cryptoMap.get(this.finalCurrency)
                fetch(cryptoUrl)
                .then(response => response.json())
                .then(result => this.finalScope = (this.cryptoInUsd / result[0].price_usd).toFixed(7))
            }
            let restriction = document.querySelector('.restriction')
            restriction.style.color = 'rgb(65, 57, 57)'
        },
        highlighting() {
            let restriction = document.querySelector('.restriction')
            restriction.style.color = 'red'
        }
    }
}
</script>

<style scoped lang="scss">
@import '../extends';

h4 {
    @extend %section-head;
}
.scope {
    @extend %flex-wrapper;
}
label {
    @extend %labels;
}
input {
    @extend %inputs;
    @extend %inputs-padding;
}
.scope-label {
    @extend %labels;
}
.final-scope {
    @extend %inputs;
    @extend %inputs-padding;
}
.restriction {
    font-size: 3.7vw;
    margin: 0 auto;
    @media(min-width: 576px) {
        font-size: 3.2vw; 
    }
    @media(min-width: 768px) {
        font-size: 2.9vw; 
    }
    @media(min-width: 991px) {
        font-size: 2.7vw; 
    }
    @media(min-width: 1200px) {
        font-size: 1.8vw; 
    }
    @media(min-width: 1200px) {
        font-size: 1.55vw; 
    }
}
</style>