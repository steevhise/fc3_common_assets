/**
* Note: this file is provided by the fc3_common_assets package
 */
import Vue from 'vue';
import { EventBus } from '../components/EventBus';

// components
import Test from '../components/Test.vue';
import Editor from '../components/Editor.vue';
import FormButton from '../components/FormButton.vue';
import Form from '../components/Form.vue';

// instantiate vue
const VueInit = new Vue({
    el: '.content-container',
    // register components
    components: {
        'fc-test': Test,
        'fc-editor': Editor,
        'fc-formbutton': FormButton,
        'fc-form': Form
    }
});

export { VueInit, EventBus };