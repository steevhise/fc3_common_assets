import Vue from 'vue';
import { EventBus } from '../components/EventBus';

// components
import Test from '../components/Test.vue';
import Editor from '../components/Editor.vue';
import FormButton from '../components/FormButton.vue';
import Form from '../components/Form.vue';
import Callout from '../components/Callout.vue';

// instantiate vue
const VueInit = new Vue({
    el: '.content-container',
    // register components
    components: {
        'fc-test': Test,
        'fc-editor': Editor,
        'fc-formbutton': FormButton,
        'fc-form': Form,
        'fc-callout': Callout
    }
});

export { VueInit, EventBus };