<template>
    <transition name="fade" :duration="timer">
        <div id="callout" v-if="isVisible" :class="`callout ${this.level}`" data-closable="slide-out-right">
            <h5 v-if="header">{{header}}</h5>
            <p v-html="message"></p>
        </div>
    </transition>
</template>

<script>
    export default {
        name : 'fc-callout',
        data() {
            return {
                isVisible: false,
                timer: 5000, // time in ms
                message: null,
                level: 'primary', // secondary, success, info, warning, alert
                header: null
            }
        },
        created() {
            this.$bus.$on('alert', (data) => {
                this.init(data);
            });
        },
        methods: {
            init(data) {
                Object.assign(this, data);
                this.isVisible = true;
                setTimeout(() => {
                    this.isVisible = false;
                }, this.timer);
            }
        }
    }
</script>

<style scoped>
    #callout {
        position: fixed;
        z-index:10;
        top: 10px;
        right: 10px;
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .6s
    }
    .fade-enter, .fade-leave-to {
      opacity: 0
    }
</style>
