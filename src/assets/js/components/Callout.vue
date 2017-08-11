<template>
    <div v-if="isVisible" :class="`callout ${this.level}`" data-closable="slide-out-right">
        <h5>Notice!</h5>
        <p>{{message}}</p>
    </div>
</template>

<script>
    import {EventBus as bus} from './EventBus';
    export default {
        data() {
            return {
                isVisible: false,
                timer: 5000,
                message: null,
                level: 'primary'
            }
        },
        created() {
            bus.$on('alert', (data) => {
                console.log(data);
                this.init(data);
            });
        },
        methods: {
            init(data) {
                this.level = data.level;
                this.message = data.message;
                this.isVisible = true;
                setTimeout(() => {
                    this.isVisible = false;
                }, this.timer);
            }
        }
    }
</script>