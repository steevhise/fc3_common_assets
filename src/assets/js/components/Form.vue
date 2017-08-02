<template>
    <div>
        <div v-if="message" id="message" >{{message}}</div>
        <form :method="method" :action="action" :classname="classname" :id="id"  @change="getFormData" >
            <slot></slot>
        </form>
    </div>
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
                message: null,
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
            }/*,
            handleSubmit(event) {
                if (event) {
                    this.$el.submit((err, res)=> {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(res);
                        }
                    });
                }
            }*/
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