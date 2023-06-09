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
            <input type="number" id="initial-scope" v-model="initialScope" @input="convert" @focus="inputFocus" @blur="inputBlur">
        </div>
        <div class="scope">
            <p class="scope-label">Final scope</p>
            <InfoOutput>{{ finalScope }}</InfoOutput>
        </div>
        <p class="restriction">
            The final scope should not exceed $10,000!
        </p>
    </article>
</template>

<script>
import CurrencySelector from './CurrencySelector.vue'
import InfoOutput from './InfoOutput.vue'

export default {
    name: 'CurConverter',
    components: {
        CurrencySelector,
        InfoOutput
    },
    data() {
        return {
            initialCurrency: 'USD',
            finalCurrency: 'BTC',
            initialScope: 0,
            finalScope: 0
        }
    },
    methods: {
        saveInitialCurrency(val) {
            this.initialCurrency = val
            if (this.initialScope > 0) {this.convert()}
        },
        saveFinalCurrency(val) {
            this.finalCurrency = val
            if (this.initialScope > 0) {this.convert()}
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
        convert() {
            const cryptoMap = new Map(this.$store.state.crypto)
            if (!cryptoMap.has(this.initialCurrency) && !cryptoMap.has(this.finalCurrency)) {
                let url = "https://v6.exchangerate-api.com/v6/1a0696dec132d55ac8c41644/pair/" + this.initialCurrency + "/" + this.finalCurrency + "/" + this.initialScope
                fetch(url)
                .then(response => response.json())
                .then(result => {
                    if (this.initialCurrency === 'USD') {
                        if (result.conversion_result > 10000) {
                            this.highlighting()
                        } else {
                            this.finalScope = result.conversion_result.toFixed(4)
                        }
                    } else {
                        let urlForUsd = "https://v6.exchangerate-api.com/v6/1a0696dec132d55ac8c41644/pair/" + this.initialCurrency + "/USD/" + this.initialScope
                        fetch(urlForUsd)
                        .then(response => response.json())
                        .then(res => {
                            if (res.conversion_result > 10000) {
                                this.highlighting()
                            } else {
                                this.finalScope = result.conversion_result.toFixed(4)
                            }
                        })
                    }
                })
            } else if (!cryptoMap.has(this.initialCurrency) && cryptoMap.has(this.finalCurrency)) {
                let cryptoUrl = "https://api.coinlore.net/api/ticker/?id=" + cryptoMap.get(this.finalCurrency)
                fetch(cryptoUrl)
                .then(response => response.json())
                .then(result => {
                    let cryptoPriceUsd = result[0].price_usd
                    if (this.initialCurrency === 'USD') {
                        if (this.initialScope > 10000) {
                            this.highlighting()
                        } else {
                            this.finalScope = (this.initialScope / cryptoPriceUsd).toFixed(7)
                        }  
                    } else {
                        let curUrl = "https://v6.exchangerate-api.com/v6/1a0696dec132d55ac8c41644/pair/" + this.initialCurrency + "/USD/" + this.initialScope
                        fetch(curUrl)
                        .then(response => response.json())
                        .then(res => {
                            if (res.conversion_result > 10000) {
                                this.highlighting()
                            } else {
                                this.finalScope = (res.conversion_result / cryptoPriceUsd).toFixed(7)
                            }
                        })
                    }
                })
            } else if (cryptoMap.has(this.initialCurrency) && !cryptoMap.has(this.finalCurrency)) {
                let cryptoUrl = "https://api.coinlore.net/api/ticker/?id=" + cryptoMap.get(this.initialCurrency)
                fetch(cryptoUrl)
                .then(response => response.json())
                .then(result => {
                    let cryptoInUsd = this.initialScope * result[0].price_usd
                    if (cryptoInUsd > 10000) {
                            this.highlighting()
                    } else {
                        if (this.finalCurrency === 'USD') {
                            this.finalScope = cryptoInUsd.toFixed(4)
                        } else {
                            let curUrl = "https://v6.exchangerate-api.com/v6/1a0696dec132d55ac8c41644/pair/" + this.finalCurrency + "/USD/"
                            fetch(curUrl)
                            .then(response => response.json())
                            .then(res => this.finalScope = (cryptoInUsd / res.conversion_rate).toFixed(4))
                        }
                    }
                })  
            } else {
                let cryptoUrl1 = "https://api.coinlore.net/api/ticker/?id=" + cryptoMap.get(this.initialCurrency)
                fetch(cryptoUrl1)
                .then(response => response.json())
                .then(result => {
                    let firstCryptoPriceUsd = result[0].price_usd
                    let firstCryptoInUsd = this.initialScope * firstCryptoPriceUsd
                    if (firstCryptoInUsd > 10000) {
                            this.highlighting()
                    } else {
                        let cryptoUrl2 = "https://api.coinlore.net/api/ticker/?id=" + cryptoMap.get(this.finalCurrency)
                        fetch(cryptoUrl2)
                        .then(response => response.json())
                        .then(res => this.finalScope = (firstCryptoInUsd / res[0].price_usd).toFixed(7))
                    }
                })
            }
            let restriction = document.querySelector('.restriction')
            restriction.style.color = 'rgb(65, 57, 57)'
        },
        highlighting() {
            let restriction = document.querySelector('.restriction')
            restriction.style.color = 'red'
            this.finalScope = 0
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