<template>
    <transition name="fade" :duration="timer">
        <div id="callout" v-if="isVisible" :class="`callout large ${this.level}`" data-closable>
          <div id="callbox">
            <h5 v-if="header">{{ header }}</h5>
            <p v-html="message"></p>
          </div>
          <button class="close-button" aria-label="Dismiss alert" type="button" data-close onclick="this.isVisible = false;">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
    </transition>
</template>

<script>
    export default {
        name : 'fc-callout',
        data() {
            return {
                isVisible: false,
                timer: 5000, // time in ms that the callout shows
                message: null,
                level: 'primary', // secondary, success, info, warning, alert
                header: null
            }
        },
        created() {
            // handle event for legacy bus events.
            window.vm.$bus.$on('alert', (data) => {
                this.init(data);
            });

            // handle event for root events
            window.vm.$root.$on('alert', (data) => {
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

    #callbox {
        position: relative;
        height: 100%;
        margin: 0;
        padding: -100px;
    }

    p {
        font-size: 2rem;
        line-height: 3rem;
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .6s
    }
    .fade-enter, .fade-leave-to {
      opacity: 0
    }

</style>
