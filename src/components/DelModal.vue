<template>
    <div class="background-mod" @click="close">
        <div class="modal-window" @click.stop>
            <p>Do you want to remove {{ toDel }} from Target Currencies?</p>
            <div>
                <MyButton class="btn-mod" @click="removeFromLocalSt">Remove</MyButton>
                <MyButton class="btn-mod" @click="close">Cancel</MyButton>
            </div>
        </div>
    </div>
</template>

<script>
import MyButton from './MyButton.vue'

export default {
    name: 'DelModal',
    components: {MyButton},
    props: ['toDel'],
    methods: {
        removeFromLocalSt() {
            this.$emit('removePressed', this.toDel)
            let added = JSON.parse(localStorage.getItem('addedCurrencies'))
            let delIndex = added.indexOf(this.toDel)
            added.splice(delIndex, 1)
            if (added.length === 0) {
                localStorage.removeItem('addedCurrencies')
            } else {
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
p {
    line-height: 1.5;
    font-size: calc(10px + 1.5vw);
    margin-bottom: 10vw;
    @media(min-width: 768px) {
        margin-bottom: 7.8vw;
    }
    @media(min-width: 1200px) {
        margin-bottom: 6.3vw;
    }
    @media(min-width: 1400px) {
        margin-bottom: 5.2vw; 
    }
}
.btn-mod {
    @extend %modal-btn
}
</style>