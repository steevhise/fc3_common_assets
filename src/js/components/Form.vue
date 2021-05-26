<!--Note: this file is provided by the fc3_common_assets package */-->
<template>
    <form :method="method" :action="action" @change="serializeData()" @submit.prevent="handleSubmit($event)" :data-running="running.toString()">
        <slot :formData="formData" ></slot>
        <div class="form-overlay">
            <div class="content">
                <fc-spinner :size="size" :message="t('Loading...')" ></fc-spinner>
            </div>
        </div>
    </form>
</template>

<style scoped>
    .form-overlay {
        display: none;
    }
</style>

<script>
    export default {
        name : 'fc-form',
        props: {
            method: {
                type: String,
                default: () => `POST`
            },
            action: {
                type: String,
                default: () => `/actions/`
            },
            timeout: {
                type: [Number,String],
                default: '0'
            },
            customErrorMessage: {
                type: String,
                default: ''
            },
            size: {
                type: String,
                default: 'huge'
            },
            data: {},
            //results: {},
            customAlertEl: {
                // takes the unique id of the element listening for form success; prevents multiple forms on same page
                // reacting to each other's success events
                type: [Number,String]
            }
        },
         created() {

            const self = this;

            if (self.customAlertEl) {
              // handle event for legacy bus events.
              window.vm.$bus.$on(`formSuccess-${self.customAlertEl}`, (data) => {
                console.debug(self.results);
              });
            }

         },
        data() {
            return {
                formData: this.data ? JSON.parse(this.data) : {},
                serializedData: null,
                isSubmitted: false,
                results: null,
                running: false
            }
        },
        mounted() {
            // as soon as the component loads we want to proceed and serialize the existing data.
            this.serializeData();
        },
        methods: {
            serializeData() {
                this.serializedData = $(this.$el).serialize();
            },
            handleSubmit(event) {

                const self = this;
                self.setRunning(true);
                $.post({ url: this.action, data: this.serializedData, timeout: this.timeout }).done(function(data) {

                    if (self.customAlertEl) {
                        // Allow caller to handle alert in a custom way (allows parent to take over)
                        window.vm.$bus.$emit(`formSuccess-${self.customAlertEl}`, data);
                    } else {
                        window.vm.$bus.$emit('alert', { level : 'success', message : data.message || data });
                    }
                    self.setRunning(false);
                    event.target.reset();
                }).fail(function(error) {

                    console.debug(error);
                    if (error.statusText === 'timeout') {
                        let message = self.customErrorMessage || 'timeout';
                        window.vm.$bus.$emit('alert', { level : 'alert', message, timer: 10000 });

                    }
                    else {
                         const err = error.responseJSON;   // not sure if this is accurate but i don't want to break something else.
                         window.vm.$bus.$emit('alert', {level: 'alert', message: err.message, timer: 10000});
                    }
                    self.setRunning(false);
                })
            },
            setRunning(opt) {
                this.running = opt;
            }
        }
    }
</script>

<style scoped>



</style>
