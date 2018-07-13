<!--Note: this file is provided by the fc3_common_assets package */-->
<template>
    <form :method="method" :action="action" :id="id" @change="serializeData()" @submit.prevent="handleSubmit($event)">
        <slot :formData="formData" ></slot>
    </form>
</template>

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
            data: {}
        },
        data() {
            return {
                formData: this.data ? JSON.parse(this.data) : {},
                serializedData: null
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

                $.post(this.action, this.serializedData).done(function(data) {

                    self.$bus.$emit('alert', { level : 'success', message : data.message });
                    self.$bus.$emit('formSuccess');
                    event.target.reset();
                }).fail(function(error) {

                    const err = error.responseJSON;
                    self.$bus.$emit('alert', { level : 'alert', message : err.message, timer: 10000 });
                })
            }
        }
    }
</script>
