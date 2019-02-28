<!--Note: this file is provided by the fc3_common_assets package */-->
<template>
    <form :method="method" :action="action" @change="serializeData()" @submit.prevent="handleSubmit($event)">
        <slot :formData="formData" ></slot>

        <div v-if="customAlertEl" id="form-results">{{ results }}</div>
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
              this.$bus.$on(`formSuccess-${self.customAlertEl}`, (data) => {
                // do stuff to a div called form-results-n if it exists.
                console.log(data.data);
                self.results = JSON.stringify(data.data.users);
                console.warn(self.results);

                // console.warn(`#form-results-${self.customAlertEl}`);
                //$(`#form-results-${self.customAlertEl}`).html = ' the results:<p>' + JSON.stringify(data.data);
              });
            }

         },
        data() {
            return {
                formData: this.data ? JSON.parse(this.data) : {},
                serializedData: null,
                isSubmitted: false,
                results: null
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

                    if (self.customAlertEl) {
                      console.log(`formSuccess-${self.customAlertEl}`);
                        // Allow caller to handle alert in a custom way (allows parent to take over)
                        self.$bus.$emit(`formSuccess-${self.customAlertEl}`, data);
                    } else {
                        self.$bus.$emit('alert', { level : 'success', message : data.message || data });
                    }

                    event.target.reset();
                }).fail(function(error) {

                    const err = error.responseJSON;
                    self.$bus.$emit('alert', { level : 'alert', message : err.message, timer: 10000 });
                })
            }
        }
    }
</script>

<style scoped>
    #form-results {
        font-size: 10pt;
        max-height: 10em;
        overflow: scroll;
    }


</style>