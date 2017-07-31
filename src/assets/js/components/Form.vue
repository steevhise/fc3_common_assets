<template>
    
    <form :method="method" :action="action" :id="id" v-on:submit.prevent="handleSubmit" @change="getFormData">
        <slot></slot>
        <!-- <div v-if="message" id="message">{{message}}</div> -->
    </form>
</template>

<script>
export default {
    name: 'fc-form',
    props: {
        method: {
            type: String,
            default: () => `POST`
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
        },
        handleSubmit(event) {
            if (event) {
                this.$el.submit((err, res) => {
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

<style>
#message {
    background-color: #34b233;
    text-align: center;
    color: white;
    vertical-align: middle;
    margin: 0 auto;
    position: relative;
    top: 50%;
}
</style>