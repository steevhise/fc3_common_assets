/** * Note: this file is provided by the fc3_common_assets package */
<template>
    <button :type="type" :role="submit" :class="classname" @click.prevent="handleClick" >
        <slot>Form Button</slot>
    </button>
</template>

<script>
    import Test from './Test.vue';
    export default {
        name : 'fc-formbutton',
        components: {

        },
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
                default: () => `${t('No Label')}`
            },
            method: {
                type: String,
                default: () => `/actions/test`
            }
        },
        data() {
            return {
                results: {},
                target: {},
                formData: {}
            }
        },
        mounted() {
            this.target = this.$parent.$refs.post_edit_form;
        },
        methods: {
            // TODO: Finish Writing Actions Route, and post the data to the action where we will handle the mutation.
            handleClick(e) {
                let self = this;
                $.each($(this.target).serializeArray(), function() {
                    self.results[this.name] = this.value;
                });
                this.handleData('postSave', this.results);
            },
            handleData(method, data) {
                $(this.target).attr('action', `/actions?method=${method}&data=${JSON.stringify(data)}`);
                $(this.target).submit();
            }
        }
    }
</script>
