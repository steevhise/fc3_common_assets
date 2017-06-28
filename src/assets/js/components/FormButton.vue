<template>
    <button :type="type" :role="submit" :class="className" @click.prevent="handleClick" >{{text}}</button>
</template>

<script>
    export default {
        name : 'fc-formbutton',
        props: {
            type: {
                type: String,
                default: () => `submit`
            },
            role: {
                type: String,
                default: () => `submit`
            },
            className: {
                type: String,
                default: () => `btn-default btn-wide`
            },
            text: {
                type: String,
                default: () => `No Label`
            },
            method: {
                type: String,
                default: () => `/actions/test`
            }
        },
        data() {
            return {
                results: {}
            }
        },
        mounted() {

        },
        methods: {
            // TODO: Finish Writing Actions Route, and post the data to the action where we will handle the mutation.
            handleClick(e) {
                let target = this.$parent.$refs.post_edit_form;
                let self = this;
                $.each($(target).serializeArray(), function() {
                    self.results[this.name] = this.value;
                });
            }
        }
    }
</script>