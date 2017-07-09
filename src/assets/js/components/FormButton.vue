<template>
    <button :type="type" :role="submit" :class="classname" @click.prevent="handleClick" >
        <slot>Form Button</slot>
    </button>
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
            classname: {
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
                this.handleData('postSave', this.results);
            },
            handleData(method, data) {
                $.post(`/actions?method=${method}&data=${JSON.stringify(data)}`);
            }
        }
    }
</script>