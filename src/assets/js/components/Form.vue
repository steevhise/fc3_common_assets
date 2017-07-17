<template>
    <form :method="method" :action="action" :classname="classname" :id="id" v-on:submit.prevent="handleSubmit" @change="getFormData" >
        <slot></slot>
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
            classname: {
                type: String,
                default: () => `btn-default btn-wide`
            },
            action: {
                type: String,
                default: () => `/actions/`
            }
        },
        data() {
            return {
                message: {},
                formData: {}
            }
        },
        created() {
          this.$on('formUpdated', (data) => {
              this.getFormData();
          });
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
                console.log(event);
                if (event) {
                    this.$el.submit((err, res)=> {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(res);
                        }
                    });
                }
            }
        }
    }
</script>