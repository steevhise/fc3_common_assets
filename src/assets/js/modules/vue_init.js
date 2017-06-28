import Vue from 'vue';

// components
import Test from '../components/Test.vue';
import Editor from '../components/Editor.vue';

// instantiate vue
const VueInit = new Vue({
    el: '.content-container',
    // register components
    components: {
        'fc-test': Test,
        'fc-editor': Editor
    }
});

export default VueInit;