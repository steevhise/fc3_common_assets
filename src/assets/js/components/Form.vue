<template>
    <form :method="method" :action="action" :classname="classname" :id="id" v-on:change="getFormData" @submit.prevent="handleSubmit">
        <slot></slot>
    </form>
</template>

<script>
    import { EventBus as bus } from './EventBus';
    export default {
        name : 'fc-form',
        props: {
            method: {
                type: String,
                default: () => `POST`
            },
            classname: {
                type: String,
                default: () => `btn-default btn-wide`
            },
            action: {
                type: String,
                default: () => `/actions/`
            },
            data: {}
        },
        data() {
            return {
                message: null,
                formData: {},
                resultData: {}
            }
        },
        created() {
          bus.$emit('alert', 'hello world')
        },
        mounted() {
            
        },
        methods: {
            getFormData() {
                $.each($(this.$el).serializeArray(), (index, element) => {
                    this.formData[element.name] = element.value;
                });
            },
            handleSubmit(event) {
                event.preventDefault();
                this.getFormData();
                if (event) {
                    $.post(this.action, this.formData, (err, response) => {
                        if (err) {
                            console.log(err);
                            this.message = err;
                        } else {
                            bus.$emit('alert', {
                                level: 'info',
                                message: res.message
                            });
                            console.log(res);
                        }
                    })
                }
            }
        }
    }
</script>

<style>
    #message {
        background-color: #34b233;
        text-align: center;
        color: white;
        vertical-align: middle;
        margin:0 auto;
        position: relative;
        top:50%;
    }
</style>